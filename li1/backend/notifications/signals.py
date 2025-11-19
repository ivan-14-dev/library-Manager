from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Message, ReadingReport, BookRating, Notification

User = get_user_model()


@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    """
    Créer une notification lorsqu'un message est envoyé
    """
    if created:
        Notification.objects.create(
            user=instance.receiver,
            title="Nouveau message",
            message=f"Vous avez reçu un message de {instance.sender.username}",
            notification_type="MESSAGE",
            related_object_id=instance.id,
            related_content_type="message"
        )


@receiver(post_save, sender=ReadingReport)
def create_report_notification(sender, instance, created, **kwargs):
    """
    Créer une notification lorsqu'un rapport de lecture est créé
    """
    if created:
        # Notification pour l'auteur du livre (si différent de l'utilisateur actuel)
        if hasattr(instance.book, 'author') and instance.book.author != instance.user:
            Notification.objects.create(
                user=instance.book.author,
                title="Nouveau rapport de lecture",
                message=f"{instance.user.username} a publié un rapport sur votre livre '{instance.book.title}'",
                notification_type="COMMENT",
                related_object_id=instance.id,
                related_content_type="reading_report"
            )


@receiver(post_save, sender=BookRating)
def create_rating_notification(sender, instance, created, **kwargs):
    """
    Créer une notification lorsqu'une note est attribuée
    """
    if created:
        # Notification pour l'auteur du livre
        if hasattr(instance.book, 'author') and instance.book.author != instance.user:
            Notification.objects.create(
                user=instance.book.author,
                title="Nouvelle note",
                message=f"{instance.user.username} a noté votre livre '{instance.book.title}' avec {instance.rating}★",
                notification_type="RATING",
                related_object_id=instance.id,
                related_content_type="book_rating"
            )


@receiver(post_save, sender=User)
def create_welcome_notification(sender, instance, created, **kwargs):
    """
    Créer une notification de bienvenue pour les nouveaux utilisateurs
    """
    if created:
        Notification.objects.create(
            user=instance,
            title="Bienvenue !",
            message="Bienvenue sur notre plateforme. Commencez à explorer nos livres et fonctionnalités.",
            notification_type="INFO"
        )


# Signaux pour les emprunts et réservations
@receiver(post_save, sender='borrow.Borrow')
def create_borrow_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les emprunts
    """
    if created:
        # Notification pour l'utilisateur qui emprunte
        Notification.objects.create(
            user=instance.user,
            title="Emprunt confirmé",
            message=f"Vous avez emprunté '{instance.book.title}'. Date de retour: {instance.due_date.strftime('%d/%m/%Y')}",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="borrow"
        )

        # Notification pour les administrateurs/bibliothécaires
        from users.models import User
        librarians = User.objects.filter(role__in=['LIBRARIAN', 'ADMIN'])
        for librarian in librarians:
            Notification.objects.create(
                user=librarian,
                title="Nouvel emprunt",
                message=f"{instance.user.username} a emprunté '{instance.book.title}'",
                notification_type="ALERT",
                related_object_id=instance.id,
                related_content_type="borrow"
            )


@receiver(post_save, sender='borrow.Reservation')
def create_reservation_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les réservations
    """
    if created:
        # Notification pour l'utilisateur qui réserve
        Notification.objects.create(
            user=instance.user,
            title="Réservation confirmée",
            message=f"Votre réservation pour '{instance.book.title}' a été enregistrée.",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="reservation"
        )


# Signaux pour les groupes et communautés
@receiver(post_save, sender='groups.GroupMember')
def create_group_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les adhésions aux groupes
    """
    if created:
        Notification.objects.create(
            user=instance.user,
            title="Bienvenue dans le groupe",
            message=f"Vous avez rejoint le groupe '{instance.group.name}'",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="group_membership"
        )


@receiver(post_save, sender='publishing.CircleMembership')
def create_circle_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les adhésions aux cercles d'amis
    """
    if created:
        Notification.objects.create(
            user=instance.user,
            title="Bienvenue dans le cercle",
            message=f"Vous avez été ajouté au cercle '{instance.circle.name}'",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="circle_membership"
        )


# Signaux pour les publications
@receiver(post_save, sender='publishing.PublicationRequest')
def create_publication_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les demandes de publication
    """
    if created:
        # Notification pour l'utilisateur
        Notification.objects.create(
            user=instance.requested_by,
            title="Demande de publication envoyée",
            message=f"Votre demande de publication pour '{instance.personal_book.title}' a été soumise.",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="publication_request"
        )

        # Notification pour les administrateurs
        from users.models import User
        admins = User.objects.filter(role='ADMIN')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                title="Nouvelle demande de publication",
                message=f"{instance.requested_by.username} demande la publication de '{instance.personal_book.title}'",
                notification_type="ALERT",
                related_object_id=instance.id,
                related_content_type="publication_request"
            )


# Signaux pour les paiements
@receiver(post_save, sender='payments.Payment')
def create_payment_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les paiements
    """
    if created:
        status_messages = {
            'PENDING': 'Votre paiement est en cours de traitement.',
            'COMPLETED': 'Votre paiement a été traité avec succès.',
            'FAILED': 'Votre paiement a échoué. Veuillez réessayer.',
            'REFUNDED': 'Votre paiement a été remboursé.'
        }

        Notification.objects.create(
            user=instance.user,
            title="Mise à jour de paiement",
            message=f"{instance.description}: {status_messages.get(instance.status, 'Statut inconnu')}",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="payment"
        )


# Signaux pour les conversations IA
@receiver(post_save, sender='ai.AIConversation')
def create_ai_conversation_notifications(sender, instance, created, **kwargs):
    """
    Créer des notifications pour les conversations IA
    """
    if created and instance.conversation_type == 'GENERAL':
        Notification.objects.create(
            user=instance.user,
            title="Nouvelle conversation IA",
            message="Une nouvelle conversation avec l'assistant IA a été créée.",
            notification_type="INFO",
            related_object_id=instance.id,
            related_content_type="ai_conversation"
        )
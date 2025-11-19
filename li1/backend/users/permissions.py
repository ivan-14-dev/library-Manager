from rest_framework.permissions import BasePermission


class IsVisitor(BasePermission):
    """
    Permission pour les visiteurs (rôle VISITOR)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'VISITOR'


class IsStudent(BasePermission):
    """
    Permission pour les étudiants (rôle STUDENT)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'STUDENT'


class IsProfessor(BasePermission):
    """
    Permission pour les professeurs (rôle PROFESSOR)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'PROFESSOR'


class IsLibrarian(BasePermission):
    """
    Permission pour les bibliothécaires (rôle LIBRARIAN)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'LIBRARIAN'


class IsAdmin(BasePermission):
    """
    Permission pour les administrateurs (rôle ADMIN)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'


class IsLibrarianOrAdmin(BasePermission):
    """
    Permission pour les bibliothécaires ou administrateurs
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_librarian()


class IsProfessorOrAdmin(BasePermission):
    """
    Permission pour les professeurs ou administrateurs
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role in ['PROFESSOR', 'ADMIN']
        )


class IsStudentOrHigher(BasePermission):
    """
    Permission pour les étudiants et rôles supérieurs
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            'STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN'
        ]


class HasActiveSubscription(BasePermission):
    """
    Permission basée sur l'abonnement actif
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            subscription = request.user.subscription
            return subscription.is_active
        except:
            return False


class HasPremiumSubscription(BasePermission):
    """
    Permission pour les abonnements premium
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            subscription = request.user.subscription
            return subscription.is_active and subscription.plan_type in ['professor', 'premium']
        except:
            return False

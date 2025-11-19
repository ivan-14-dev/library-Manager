from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.conf import settings
import os
from .models import ExportJob
from .serializers import ExportJobSerializer


class ExportJobViewSet(viewsets.ModelViewSet):
    queryset = ExportJob.objects.all()
    serializer_class = ExportJobSerializer

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Télécharger le fichier exporté"""
        try:
            export_job = self.get_object()
            if export_job.status != 'completed':
                return Response(
                    {'error': 'Export non terminé'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file_path = export_job.file_path
            if not os.path.exists(file_path):
                return Response(
                    {'error': 'Fichier non trouvé'},
                    status=status.HTTP_404_NOT_FOUND
                )

            with open(file_path, 'rb') as f:
                response = HttpResponse(
                    f.read(),
                    content_type='application/octet-stream'
                )
                response['Content-Disposition'] = f'attachment; filename="{export_job.filename}"'
                return response

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        """Obtenir la progression de l'export"""
        export_job = self.get_object()
        return Response({
            'id': export_job.id,
            'status': export_job.status,
            'progress': export_job.progress,
            'message': export_job.message,
            'created_at': export_job.created_at,
            'completed_at': export_job.completed_at
        })


class ExportDownloadView(viewsets.ViewSet):
    """Vue pour le téléchargement direct d'export"""

    def retrieve(self, request, job_id=None):
        try:
            export_job = ExportJob.objects.get(id=job_id)
            return ExportJobViewSet().download(request, pk=job_id)
        except ExportJob.DoesNotExist:
            return Response(
                {'error': 'Job d\'export non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class ExportProgressView(viewsets.ViewSet):
    """Vue pour vérifier la progression d'un export"""

    def retrieve(self, request, job_id=None):
        try:
            export_job = ExportJob.objects.get(id=job_id)
            return ExportJobViewSet().progress(request, pk=job_id)
        except ExportJob.DoesNotExist:
            return Response(
                {'error': 'Job d\'export non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

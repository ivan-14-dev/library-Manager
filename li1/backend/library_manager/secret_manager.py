import boto3
import json
from botocore.exceptions import ClientError, NoCredentialsError
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

def get_secret(secret_name):
    """Récupère un secret depuis AWS Secrets Manager"""
    region_name = "eu-west-1"  # Modifier selon votre région AWS

    session = boto3.session.Session()
    client = session.client(
        service_name="secretsmanager",
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except (ClientError, NoCredentialsError) as e:
        error_msg = f"Erreur lors de la récupération du secret {secret_name}: {str(e)}"
        if settings.DEBUG:
            return os.environ.get(secret_name)
        raise ImproperlyConfigured(error_msg)

    if "SecretString" in get_secret_value_response:
        secret = get_secret_value_response["SecretString"]
        return json.loads(secret).get(secret_name)
    
    return None


def rotate_secret(secret_name):
    """Lance la rotation d'un secret"""
    client = boto3.client("secretsmanager")
    try:
        response = client.rotate_secret(SecretId=secret_name)
        return response
    except ClientError as e:
        error_msg = f"Échec de la rotation du secret {secret_name}: {str(e)}"
        raise ImproperlyConfigured(error_msg)
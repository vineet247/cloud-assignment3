import json
import boto3
import time
from botocore.vendored import requests

def lambda_handler(event, context):
    # TODO implement
    print('event: ', )
    photoData = event['Records'][0]
    bucket = photoData['s3']['bucket']['name']
    key = photoData['s3']['object']['key']
    try:
        imageObject = getImageLabels(bucket, key)
        elasticIndex(imageObject)
    except Exception as e:
        print("Error "+ str(e))

    return {
        'statusCode': 200,
        'body': json.dumps('Photo indexed into ElasticSearch!')
    }


def getImageLabels(bucket, key):

    reko=boto3.client('rekognition','us-east-1')
    response = reko.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':key}})
    imageLabels = []

    for label in response['Labels']:
	    imageLabels.append(label['Name'].lower())

    print(imageLabels)

    imageObject = {
        'objectKey': key,
        'bucket': bucket,
        'createdTimestamp': time.time(),
        'labels': imageLabels
    }

    return imageObject


def elasticIndex(imageObject):
    #url = 'https://vpc-photos-hwaarhxgs6sp2i67fqyjwdyg3y.us-east-1.es.amazonaws.com/photos/Photo'
    url = 'https://vpc-photos-s3xlu5o3dfqiqj3rfws2ai5dny.us-east-1.es.amazonaws.com/photos/Photo'

    headers = {'Content-type': 'application/json'}

    #data=json.dumps(imageObject)

    print("Entered indexing")

    response = requests.post(url=url, data=json.dumps(imageObject).encode("utf-8"), headers=headers)

    print(response, response.text)
    

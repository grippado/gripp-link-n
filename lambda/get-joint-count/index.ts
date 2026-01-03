import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const TABLE_NAME = process.env.JOINT_COUNT_TABLE_NAME || 'joint-count'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    // Get user ID from query params or use default
    const userId = event.queryStringParameters?.userId || 'default'

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId
      }
    })

    const result = await docClient.send(command)

    // If no record exists, return default values
    if (!result.Item) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          userId,
          totalJoints: 0,
          startDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    }
  } catch (error) {
    console.error('Error getting joint count:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to get joint count',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}


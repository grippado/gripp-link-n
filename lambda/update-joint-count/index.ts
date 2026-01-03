import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const TABLE_NAME = process.env.JOINT_COUNT_TABLE_NAME || 'joint-count'

interface UpdateRequest {
  userId?: string
  totalJoints?: number
  startDate?: string
  increment?: boolean
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS'
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
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Request body is required'
        })
      }
    }

    const body: UpdateRequest = JSON.parse(event.body)
    const userId = body.userId || 'default'
    const now = new Date().toISOString()

    // Get current record to handle increment and check if exists
    const { GetCommand } = await import('@aws-sdk/lib-dynamodb')
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId }
    })
    const existingRecord = await docClient.send(getCommand)

    let currentTotalJoints = 0
    let currentStartDate = body.startDate || new Date().toISOString().split('T')[0]

    if (body.increment) {
      // Fetch current value if incrementing
      if (existingRecord.Item) {
        currentTotalJoints = existingRecord.Item.totalJoints || 0
        currentStartDate = existingRecord.Item.startDate || currentStartDate
      }
      currentTotalJoints += 1
    } else {
      currentTotalJoints = body.totalJoints ?? 0
    }

    // Prepare item
    const item: any = {
      userId,
      totalJoints: currentTotalJoints,
      startDate: currentStartDate,
      updatedAt: now
    }

    // If it's a new record, set createdAt
    if (!existingRecord.Item) {
      item.createdAt = now
    } else {
      item.createdAt = existingRecord.Item.createdAt || now
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    })

    await docClient.send(command)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: item
      })
    }
  } catch (error) {
    console.error('Error updating joint count:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to update joint count',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}


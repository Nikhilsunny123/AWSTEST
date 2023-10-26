import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const ddbclient = new DynamoDBClient();

const ddbDocClient = DynamoDBDocumentClient.from(ddbclient, {})

export { ddbDocClient };
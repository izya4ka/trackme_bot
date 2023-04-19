export interface apiResponse {
  status: string;
  message?: string;
  data: Data
}

interface Data {
  lastPoint: Event,
  events: Event[]
}

export interface Event {
  operationDateTime: string
  operationPlaceName: string
  operationAttribute: string
  serviceName: string
}
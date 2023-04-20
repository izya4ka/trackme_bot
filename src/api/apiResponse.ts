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
  id: string
  operationDateTime: string
  operationPlaceName: string
  operationAttribute: string
  serviceName: string
}
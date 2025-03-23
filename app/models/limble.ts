export interface ITask {
  name: string;
  locationID: number;
  due: number;
  type: number;
  description: string;
  assetID: number;
}

export interface IAsset {
  assetID: number;
}

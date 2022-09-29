export type SerializedStateDates<T> = Omit<
  T,
  "createdAt" | "updatedAt" | "productLaunchDate"
> & {
  createdAt: string;
  updatedAt: string;
  productLaunchDate: string;
};

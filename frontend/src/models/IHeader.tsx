import { CustomerInterface } from "./ICustomer";

export interface HeaderInterface{
    ID:             number,
    Order_no:       number,
    CustomerID:     number,
    Customer:       CustomerInterface,
    Order_date:     Date,
}
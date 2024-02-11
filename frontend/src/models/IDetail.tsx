import { HeaderInterface } from "./IHeader";
import { ProductInterface } from "./IProduct";

export interface DetailInterface{
    ID:             number,
    HeaderID:       number,
    Header:         HeaderInterface,
    ProductID:      number,
    Product:        ProductInterface
    Ord_date:       Date,
    Fin_date:       Date,
    Amount:         number,
    TOT_PRC:        number,
}

// events will be public contracts between services 
// small + stable 
export type ProductCreatedEvent ={
productId: string | undefined ;
name:string | undefined ;
description :string | undefined ;
status:'DRAFT' |'ACTIVE';
price :number | undefined ,
imageUrl:string | undefined;
createdByClerkUserId:string | undefined

}
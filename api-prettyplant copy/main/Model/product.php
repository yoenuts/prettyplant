<?php
include_once(__DIR__ . '/../Controller/global.php');
class Product extends GlobalMethods
{


    public function addCart($form, $id){
        //Initial adding of product
        $params = array('plant_ID', 'user_ID', 'quantity', 'variation_Id');
        $tempForm = array(
            $form->plant,
            $id,
            $form->count,
            $form->variation,
        );


        try {
            $lastID = $this->getLastID('cart');
            $this->prepareAddBind('cart', $params, $tempForm);


            return $lastID;
            
        } catch (\Throwable $th) {
            header('HTTP/1.0 500 Internal Server Error');
            echo 'Token not found in request';
            exit;
        }

    }

    public function getProduct(){
        $sql = "SELECT * FROM product;";
        return $this->executeGetQuery($sql)['data'];
    }

    public function getVariation(){
        $sql = "SELECT * FROM variation";
        return $this->executeGetQuery($sql)['data'];
    }

    public function getCart($id){
        $sql = "SELECT *
                FROM `cart`
                INNER JOIN product on `cart`.`plant_ID`=`product`.`plant_ID`
                WHERE user_ID = $id;";
        return $this->executeGetQuery($sql)['data'];
    }

    public function deleteCart($id){
        return $this->prepareDeleteBind('cart', 'cart_ID', $id);
    }

    public function quantity($data){
        $params = array('quantity');
        $tempForm = array(
            $data->quantity,
            $data->cart_ID
        );

        try {
            //code...
            return $this->prepareEditBind('cart', $params, $tempForm, "cart_ID");
        } catch (\Throwable $th) {
            header('HTTP/1.0 500 Internal Server Error');
            echo 'Query issue: ' . $th;
            exit;
        }
    }
}

import { db } from './database/knex'

import {
  users,
  products,
  purchases
} from "./database";
import cors from 'cors'

//importando o express 👇🏽
import express, { Request, Response } from 'express'
import { TProduct, TUser, TPurchase, PRODUCT_CATEGORY } from "./types";

//invocando a função express() dentro da variável app 👇🏽
const app = express();// console.log(acessarProductsName("mouse"));
// console.log(createPurchase("1", "1", 3, 15));
app.use(express.json())
app.use(cors())

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003")
})
//não precisa de validação, basta refatorar para o uso do try/catch
app.get("/users", (req: Request, res: Response) => {
  try {
    res.status(200).send(users);
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});
//não precisa de validação, basta refatorar para o uso do try/catch
app.get("/products", (req: Request, res: Response) => {
  try {
    res.status(200).send(products);
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

//query params deve possuir pelo menos um caractere

app.get("/product/search", async (req: Request, res: Response) => {
  let productFilter;
  try {
    const q = req.query.q as string;

    if (q.length <= 1) {
      res.status(400);
      throw new Error("query params deve possuir pelo menos um caractere");
    }
    //
    const [product] = await db.raw(`
  SELECT * FROM products
  WERE LOWER(name) LIKE("%${q}%")
  `)
    res.status(200).send({ product: product });
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

/// Create User
app.post("/users", async (req: Request, res: Response) => {
  try {
      // destructuring para pegar info que vem do body
      const { id, name, email, password } = req.body;

      // id precisa existir e ser uma string
      if (typeof id !== "string"){
          res.status(400);
          throw new Error ("'id' deve existir e ser uma string");
      }
      // user precisa ter id único
      const idMatches : TUserDB[] = await db("users").where({ id });
      if (idMatches.length > 0){
          res.status(400);
          throw new Error ("Já existe um usuário com esse 'id'");
      }
      // id do user precisa ter no mínimo 4 caracteres
      if (id.length < 4){
          res.status(400);
          throw new Error ("'id' precisa ter no mínimo 4 caracteres");
      }

      // name precisa existir e ser uma string
      if (typeof name !== "string"){
          res.status(400);
          throw new Error ("'name' deve existir e ser uma string"); 
      }
      // name precisa ter no mínimo 2 caracteres
      if (name.length < 2){
          res.status(400);
          throw new Error ("'name' precisa ter no mínimo 2 caracteres");
      }

      // email precisa existir e ser uma string
      if (typeof email !== "string"){
          res.status(400);
          throw new Error ("'email' deve existir e ser uma string");
      }
      // email precisa ser único
      const emailMatches : TUserDB[] = await db("users").where({ email });
      if (emailMatches.length > 0){
          res.status(400);
          throw new Error ("Já existe um usuário com esse 'email'");
      }
      // email deve ter formato de email
      if (!emailRegex.test(email)){
          res.status(400);
          throw new Error ("'email' deve ter formato de e-mail");
      }

      // password precisa existir e ser uma string
      if (typeof password !== "string"){
          res.status(400);
          throw new Error ("'password' deve existir e ser uma string");
      }
      // password deve ter entre 4 e 8 dígitos e incluir pelo menos um dígito numérico
      if (!passwordRegex.test(password)){
          res.status(400);
          throw new Error ("password deve ter entre 4 e 8 dígitos e incluir pelo menos um dígito numérico");
      }

      // novo usuário a ser inserido
      const newUser = {
          id,
          name, 
          email, 
          password
      }

      // query para inserir o novo usuário
      await db("users").insert(newUser);
      
      res.status(201).send({
          message: "Cadastro realizado com sucesso",
          user: newUser
      }); 
  } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
          res.status(500);
      }

      if (error instanceof Error) {
          res.send(error.message);
      } else {
          res.send("Erro inesperado");
      }
  }
});
// Create Product
app.post("/products", async (req: Request, res: Response) => {
  try {
      // destructuring para pegar info que vem do body
      const { id, name, price, description, imageUrl } = req.body;
      const category = req.body.category as PRODUCT_CATEGORY;

      // id precisa existir e ser uma string
      if (typeof id !== "string"){
          res.status(400);
          throw new Error ("'id' deve existir e ser uma string");
      }
      // product precisa ter id único
      const idMatches : TProductDB[] = await db("products").where({ id });
      if (idMatches.length > 0){
          res.status(400);
          throw new Error ("Já existe um 'product' com esse 'id'");
      }
      // id do product precisa ter no mínimo 7 caracteres
      if (id.length < 7){
          res.status(400);
          throw new Error ("'id' precisa ter no mínimo 7 caracteres");
      }

      // name precisa existir e ser uma string
      if (typeof name !== "string"){
          res.status(400);
          throw new Error ("'name' deve existir e ser uma string"); 
      }
      // name precisa ter no mínimo 2 caracteres
      if (name.length < 2){
          res.status(400);
          throw new Error ("'name' precisa ter no mínimo 2 caracteres");
      }

      // price precisa existir e ser um number
      if (typeof price !== "number"){
          res.status(400);
          throw new Error ("'price' deve existir e ser um number");
      }
      // price precisa ser maior do que zero
      if (price <= 0){
          res.status(400);
          throw new Error ("'price' deve ser maior do que zero");
      }

      // description precisa existir e ser uma string
      if (typeof description !== "string"){
          res.status(400);
          throw new Error ("'description' deve existir e ser uma string");
      }
      // description precisa ter no mínimo 2 caracteres
      if (description.length < 2){
          res.status(400);
          throw new Error ("'description' deve ter no mínimo 2 caracteres");
      }

      // imageUrl precisa existir e ser uma string
      if (typeof imageUrl !== "string"){
          res.status(400);
          throw new Error ("'imageUrl' deve existir e ser uma string");
      }
      // URLs podem ter muitos formatos. Fica pendente ver se vale alguma outra verificação

      // category precisa existir e ser uma string
      if (typeof category !== "string"){
          res.status(400);
          throw new Error ("'category' deve existir e ser uma string");
      }
      // produto deve ter uma das categorias existentes
      if (
          category !== "Acessories" &&
          category !== "Clothes and Shoes" &&
          category !== "Electronics"
      ){
          res.status(400);
          throw new Error ("Produto deve ter uma categoria existente");
      }
      
      // novo produto a ser inserido
      const newProduct : TProductDB = {
          id,
          name,
          price,
          description,
          image_url: imageUrl,
          category
      };

      // query para inserir o novo produto
      await db("products").insert(newProduct);

      res.status(201).send({
          message: "Produto cadastrado com sucesso",
          product: newProduct
      });
  } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
          res.status(500);
      }

      if (error instanceof Error) {
          res.send(error.message);
      } else {
          res.send("Erro inesperado");
      }
  }
});

//Criando novo produto com o POST
//     validar o body
// extra:
// não deve ser possível criar mais de um produto com a mesma id
app.post("/products", (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;

    const findId = products.find((product) => product.id === id);

    if (findId) {
      res.status(400);
      throw new Error("ID indisponivel");
    }

    const newProduct: TProduct = {
      id,
      name,
      price,
      category,
    };

    products.push(newProduct);
    res.status(201).send("Produto criado com sucesso 😎");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});
//Compra criada com o POST
// validar o body
// extra:
// id do usuário que fez a compra deve existir no array de usuários cadastrados
// id do produto que foi comprado deve existir no array de produtos cadastrados
// a quantidade e o total da compra devem estar com o cálculo correto
app.post("/purchase", (req: Request, res: Response) => {

  try {
    const userId = req.body.userId
    const productId = req.body.productId
    const quantity = req.body.quantity
    const totalPrice = req.body.totalPrice

    const newPurchase: TPurchase = { userId, productId, quantity, totalPrice }
    purchases.push(newPurchase)
    res.status(201).send("Compra realizada com sucesso")

  } catch (error) {

  }
})
app.post("/purchases", (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const totalPrice = req.body.totalPrice;

    const findIdUser = purchases.find((purchase) => purchase.userId === userId);

    if (!findIdUser) {
      res.status(400);
      throw new Error("ID do usuario não existe");
    }

    const findIdProduct = products.find(
      (product) => product.id === productId
    );

    if (!findIdProduct) {
      res.status(400);
      throw new Error("ID do produto não existe");
    }


    if (findIdProduct.price * quantity !== totalPrice) {
      res.status(400)
      throw new Error("Total incorreto");
    }

    const newPurchase: TPurchase = {
      userId,
      productId,
      quantity,
      totalPrice,
    };

    purchases.push(newPurchase);
    res.status(201).send("Compra efetuada com sucesso 😎");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});
//exercicio1
//produtos procurados por id
app.get("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id

  const result = products.find((product) => product.id === id)
  res.status(200).send("objeto product encontrado")
})

//compras procuradas por id
app.get("/users/:id/purchase", (req: Request, res: Response) => {
  const id = req.params.id

  const result = purchases.filter((purchase) => purchase.userId === id)
  res.status(200).send(result)
})

//exercicio2
//deletar usuário por id
app.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id
  const indexToRemove = users.findIndex((user) => user.id === id)
  if (indexToRemove >= 0) {
    users.splice(indexToRemove, 1)
  }
  res.status(200).send("User apagado com sucesso")
})

//deletar product por id
app.delete("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id
  const indexToRemove = products.findIndex((product) => product.id === id)
  if (indexToRemove >= 0) {
    products.splice(indexToRemove, 1)
  }
  res.status(200).send("Produto apagado com sucesso")
})

app.delete("/purchases/:id", async (req: Request, res: Response) => {

  try {    
  const idPurchase = req.params.id
  const purchase = await db("purchases") .where({id:idPurchase})

  if(purchase){
      await db("purchases").del().where({id:idPurchase})
      res.status(200).send("Pedido cancelado  com sucesso")

  }else{
      res.status(400)
      throw new Error("Pedido não encontrado")
  }

}catch (error: any) {
  console.log(error)
  if (res.statusCode === 200) {
      res.status(500)
  }
  res.send(error.message)
}
})

//exercicio3
//Editar user por id
app.put("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id
  const newId = req.body.id as string | undefined
  const newEmail = req.body.email as string | undefined
  const newPassword = req.body.password as string | undefined



  const resultToEdit = users.find((user) => user.id === id)
  if (resultToEdit) {

    resultToEdit.id = newId || resultToEdit.id
    resultToEdit.email = newEmail || resultToEdit.email
    resultToEdit.password = newPassword || resultToEdit.password




  }
  res.status(200).send("Atualização realizada com sucesso")

})

app.put("/product/:id", (req: Request, res: Response) => {
  const id = req.params.id
  const newId = req.body.id as string | undefined
  const newName = req.body.name as string | undefined
  const newPrice = req.body.price as number
  const newCategory = req.body.category as PRODUCT_CATEGORY | undefined



  const resultToEdit = products.find((product) => product.id === id)
  if (resultToEdit) {

    resultToEdit.id = newId || resultToEdit.id
    resultToEdit.name = newName || resultToEdit.name
    resultToEdit.price = isNaN(newPrice) ? resultToEdit.price : newPrice
    resultToEdit.category = newCategory || resultToEdit.category
  }
  res.status(200).send("Produto atualizado com sucesso")
})
//knex exercicio 01
//Configure seu servidor Express para que ele se comunique com seu banco de dados via knex
// e refatore (ou recrie) os seguintes endpoints:

//users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
            SELECT * FROM users;`)
    res.status(200).send({ users: result })
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})
//products


app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
              SELECT * FROM products;`)
    res.status(200).send({ products: result })
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
})

//exercicio 02
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, email, password } = req.body
    if (typeof id !== "string") {
      res.status(400)
      throw new Error("'id' inválido, deve ser uma string");

    }
    if (typeof email !== "string") {
      res.status(400)
      throw new Error("'email' inválido, deve ser uma string");

    }
    if (typeof password !== "string") {
      res.status(400)
      throw new Error("'password' inválido, deve ser uma string");

    }
    if (id.length < 1 || email.length < 1 || password.length < 2) {
      res.status(400)
      throw new Error("'id' ou 'email' devem ter no minímo 1 caractere");

    }
    await db.raw(`
      INSERT INTO users(id, email, password)
      VALUES("${id}", "${email}", ${password});`)
    res.status(200).send(`usuário cadastrada com sucesso`)
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
      res.status(500)
    }

    if (error instanceof Error) {
      res.send(error.message)
    } else {
      res.send("Erro inesperado")
    }
  }
});
app.post("/products", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;

    const findId = products.find((product) => product.id === id);

    if (findId) {
      res.status(400);
      throw new Error("ID indisponivel");
    }

    const newProduct: TProduct = {
      id,
      name,
      price,
      category,
    };
    await db.raw(`
    INSERT INTO products(id, name, price, category)
    VALUES("${id}", "${name}", "${price}", " "${category}"");`)

    products.push(newProduct);
    res.status(201).send("Produto criado com sucesso 😎");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});
app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, total_price, paid, delivered_at, buyer_id } = req.body;

    if (typeof id != "string") {
      res.status(400);
      throw new Error("'id' invalido, deve ser uma string");
    }

    if (typeof delivered_at != "string") {
      res.status(400);
      throw new Error("'delivered_at' invalido, deve ser uma string");
    }

    if (typeof buyer_id != "string") {
      res.status(400);
      throw new Error("'buyer_id' invalido, deve ser uma string");
    }

    if (typeof total_price != "number") {
      res.status(400);
      throw new Error("'total_price' invalido, deve ser um number");
    }

    if (paid > 1 && paid < 0) {
      res.status(400);
      throw new Error("'paid' invalido, deve ser 0 ou 1");
    }

    if (
      id.length < 1 ||
      paid.length < 1 ||
      delivered_at.length < 1 ||
      buyer_id.length < 1
    ) {
      res.status(400);
      throw new Error("As informações devem ter no minimo 1 caractere");
    }

    // await db.raw(`
    //   INSERT INTO purchases (id, total_price, paid, delivered_at, buyer_id)
    //   VALUES ("${id}", "${total_price}", "${paid}", "${delivered_at}", "${buyer_id}")
    // `);

    await db.insert({
      id: id,
      total_price: total_price,
      paid: paid,
      delivered_at: delivered_at,
      buyer_id: buyer_id,

    }).into("purchases")

    res.status(200).send(`Compra cadastrada com sucesso`);
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // const [product] = await db.raw(`
    //   SELECT * FROM products
    //   WHERE id = "${id}"
    // `);

    const [product] = await db.select("*").from("products").where({ id });

    if (!product) {
      res.status(400);
      throw new Error("Produto não encontrado");
    }

    res.status(200).send({ product: product });
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});


app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [purchase] = await db.select("*").from("purchases").where({ id });

    if (!purchase) {
      res.status(400);
      throw new Error("Pedido não encontrado");
    }

    res.status(200).send({ purchase: purchase });
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }
});

app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // const purchases = await db.raw(`
    //   SELECT * FROM purchases
    //   WHERE buyer_id = "${id}"
    // `);

    const purchases = await db("purchases").where({id});

    res.status(200).send({ purchases: purchases });
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }

});


app.post("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const  quantity = req.body.quantity;
    const  totalPrice = req.body.totalPrice;

    const findId = purchases.find((product) => product.userId === userId);

    if (findId) {
      res.status(400);
      throw new Error("ID indisponivel");
    }

    const newProduct: TPurchase = {
      userId,
      productId,
      quantity,
      totalPrice
    };
    await db.raw(`
    INSERT INTO products(userId, productId, quantity, totalPrice)
    VALUES("${userId}", "${productId}", "${quantity}", "${totalPrice}");`)

    purchases.push(newProduct);

    res.status(200).send({ purchases: purchases });
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    res.send(error.message);
  }



});






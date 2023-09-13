import express, { Request, Response } from 'express';
import cors from 'cors';
import { pets } from './database';
import { PET_SIZE, TPet } from './types';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong!");
});

// GET de /pets
app.get("/pets", (req: Request, res: Response) => {

  const nameToFind = req.query.name as string

  if (nameToFind) {
    const result: TPet[] = pets.filter(
      (pet) => pet.name.toLowerCase().includes(nameToFind.toLowerCase())
    )
  
    res.status(200).send(result)
  } else {
    res.status(200).send(pets)
  }
})

// POST de /pets
app.post("/pets", (req: Request, res: Response) => {
  const id = req.body.id as string
  const name = req.body.name as string
  const age = req.body.age as number
  const size = req.body.size as PET_SIZE

  const newPet: TPet = {
    id: id,
    name: name,
    age: age,
    size: size
  }

  pets.push(newPet)
  
  res.status(201).send("Cadastro realizado com sucesso!")
})

// GET de /pets/:id

app.get('/pets/:id', (req: Request, res: Response) => {
	const idToFind = req.params.id // não precisamos forçar a tipagem aqui, porque todo path params é string

	const result = pets.find((pet) => pet.id === idToFind)

  res.status(200).send(result)
})

// PUT de /pet/:id -> também pode ser feito com patch


app.put('/pets/:id', (req: Request, res: Response) => {
  // id do pet que será atualizado chega via path params
  const idToEdit = req.params.id

  // recebemos do body o que será atualizado
  // todos os dados que podem ser atualizados são opcionais
  // se precisarmos atualizar só o age por exemplo,
  // não é necessário reenviar os outros (melhor experiência)
  // mas caso precisarmos atualizar mais de um, também é possível

  const newId = req.body.id as string | undefined         // cliente pode ou não enviar id
  const newName = req.body.name as string | undefined     // cliente pode ou não enviar name
  const newAge = req.body.age as number | undefined       // cliente pode ou não enviar age
  const newSize = req.body.size as PET_SIZE | undefined   // cliente pode ou não enviar size

  const pet = pets.find((pet) => pet.id === idToEdit)

  // pode ser que o pet não exista com a id informada no path params
  // só é possível editá-lo caso ele exista
  if (pet) {
      // se o novo dado não foi definido, então mantém o que já existe
      pet.id = newId || pet.id
      pet.name = newName || pet.name
      pet.size = newSize || pet.size

      // quando o valor for um número, é possível que seja 0 (que também é falsy)
      // então para possibilitar que venha 0, podemos fazer um ternário
      // o isNaN é uma função que checa se o argumento é um número ou não
      // caso não seja um número o isNaN retorna true, caso contrário false
      // por isso mantemos o antigo (pet.age) no true e atualizamos no false
      pet.age = isNaN(Number(newAge)) ? pet.age : newAge as number
  }

  res.status(200).send("Atualização realizada com sucesso")
})


app.delete('/pets/:id', (req: Request, res: Response) => {
  // identificação do que será deletado via path params
  const idToDelete = req.params.id

  // encontrar o index do item que será removido
  const petIndex = pets.findIndex((pet) => pet.id === idToDelete)

  // caso o item exista, o index será maior ou igual a 0
  if (petIndex >= 0) {
      // remoção do item através de sua posição
      pets.splice(petIndex, 1) // o segundo parametro indica quantos elementos a partir do splice eu quero retirar, quando indico '1' eu quero dizer que é somente aquele elemento 
  }

  //porque não com Filter ? Filter te devolve um novo array , não atribuindo os novos valores ao array principal no data base

  res.status(200).send("Item deletado com sucesso")
})
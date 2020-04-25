const { db } = require("../Util/admin");

exports.getAllTodos = (req, res) => {
  db.collection("todos")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(todos);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

exports.postOneTodo = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ title: "Ne smije biti prazno!!!" });

  const newTodoItem = {
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };

  db.collection("todos")
    .add(newTodoItem)
    .then((doc) => {
      const resTodoItem = newTodoItem;
      resTodoItem.id = doc.id;
      return res.json(resTodoItem);
    })
    .catch((err) => {
      res.json(500).json({ err: err });
      console.error(err);
    });
};

exports.deleteTodo = (req, res) => {

    const document = db.doc(`/todos/${req.params.id}`);
    console.log(req.params);
    document.get()
            .then((doc) => {
                if(!doc.exists)
                    return res.status(404).json({err: 'Todo nije pronadjen'});

                return document.delete();
            }).then(() => 
            {
                res.json({message: "Uspjesno brisanje!"});
            }).catch((err) => {
                console.error(err);
                return res.status(500).json({error: err.code });
            });
}

exports.editTodo = (req, res) => {
    if(req.body.id || req.body.createdAt)
            res.status(403).json({message: 'Ne smijes editovati!!!'});

    let document = db.collection('todos').doc(`${req.params.id}`);
    document.update(req.body)
            .then(() => {
                res.json({message: 'Updated Succesfully'});
            }).catch((err) => {
                console.error(err);
                return res.status(500).json({
                    error: err.code
                })
            })
}
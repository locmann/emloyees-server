const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Маршрут для загрузки данных сотрудников
app.get('/api/employees', (req, res) => {
  fs.readFile('./data/employees.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения данных сотрудников');
      return;
    }
    res.send(JSON.parse(data));
  });
});

// Маршрут для сохранения изменений
app.put('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedEmployee = req.body;

  fs.readFile('./data/employees.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения данных сотрудников');
      return;
    }

    const employees = JSON.parse(data);
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      res.status(404).send('Сотрудник не найден');
      return;
    }

    employees[index] = updatedEmployee;

    fs.writeFile('./data/employees.json', JSON.stringify(employees, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения данных сотрудников');
        return;
      }
      res.send(updatedEmployee);
    });
  });
});

// Маршрут для добавления нового сотрудника
app.post('/api/employees', (req, res) => {
  const newEmployee = req.body;

  fs.readFile('./data/employees.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения данных сотрудников');
      return;
    }

    const employees = JSON.parse(data);
    // Генерация нового уникального id для сотрудника
    newEmployee.id = employees.length ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
    employees.push(newEmployee);

    fs.writeFile('./data/employees.json', JSON.stringify(employees, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения данных сотрудников');
        return;
      }
      res.status(201).send(newEmployee);
    });
  });
});

// Маршрут для удаления сотрудника
app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('./data/employees.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка чтения данных сотрудников');
      return;
    }

    let employees = JSON.parse(data);
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      res.status(404).send('Сотрудник не найден');
      return;
    }

    employees = employees.filter(emp => emp.id !== id);

    fs.writeFile('./data/employees.json', JSON.stringify(employees, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сохранения данных сотрудников');
        return;
      }
      res.status(204).send();
    });
  });
});


app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

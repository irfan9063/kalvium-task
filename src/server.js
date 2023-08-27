// Import required libraries
const express = require("express"); 
const cors = require("cors"); 
const dotenv = require("dotenv"); 
const ConnectDB = require("./db/connect"); 
const Operations = require("./db/models/operations");

dotenv.config();

const app = express();

app.use(cors());
app.set('view engine','ejs')

function evaluate(expressionTokens) {
  const ops = ['plus', 'minus', 'into', 'div'];
  const precedence = {
      'plus': 1,
      'minus': 1,
      'into': 2,
      'div': 2,
  };

  const output = [];
  const opsStack = [];

  for (const token of expressionTokens) {
      if (!ops.includes(token)) {
          output.push(parseFloat(token));
      } else {
          while (
              opsStack.length > 0 &&
              precedence[opsStack[opsStack.length - 1]] >= precedence[token]
          ) {
              output.push(opsStack.pop());
          }
          opsStack.push(token);
      }
  }

  while (opsStack.length > 0) {
      output.push(opsStack.pop());
  }

  const resultStack = [];
  for (const token of output) {
      if (!isNaN(token)) {
          resultStack.push(token);
      } else {
          const operand2 = resultStack.pop();
          const operand1 = resultStack.pop();
          switch (token) {
              case 'plus':
                  resultStack.push(operand1 + operand2);
                  break;
              case 'minus':
                  resultStack.push(operand1 - operand2);
                  break;
              case 'into':
                  resultStack.push(operand1 * operand2);
                  break;
              case 'div':
                  resultStack.push(operand1 / operand2);
                  break;
              default:
                  throw new Error('Invalid operator');
          }
      }
  }

  return resultStack[0];
}


app.get('/result/*', (req, res) => {
    const p = req.params[0]; 
    const t = p.split('/'); 
    try {
        
        const sol = evaluate(t); 
        const wholeExpression = t.join(' ');
        console.log(wholeExpression,sol);
        const operation = new Operations({question: wholeExpression, result: sol});
        operation.save();
        console.log(operation);
        res.send(`Result: ${sol}`); 
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message); 
    }
});

app.get('/history',async(req,res)=>{
  const historyOperations=await Operations.find({}).sort({ _id: -1 }).limit(20);
  console.log(historyOperations)
  res.render('history.ejs',{historyOperations:historyOperations})
})

app.get("/home",(req,res)=>{
  res.render('index.ejs')
})

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    ConnectDB();
    console.log(`Server is listening on port ${PORT}`);
});

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();//contents of dotenv are now available as environment variables

const client = new OpenAI({ apiKey: process.env['api_key']});

const chatCompletion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        //characteristics of model
        {
            role: "system",
            content: "You are helpful assistant that answers in 1 line"
        },
        //user input
        {
            role: 'user',
            content: 'describe mango'
        }
    ]
})

console.log(chatCompletion.choices[0].message.content)



// const response = await client.responses.create({
//     model: 'gpt-3.5-turbo',
//     input: "Write a one-word of english."
// });

// console.log(response.output_text);
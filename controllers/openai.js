require("dotenv").config({ path: "../config.env" });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

//SUMMARIZE TEXT
exports.summarize = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize this: \n${text}`,
      max_tokens: 500,
      temperature: 0.4,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    next(err);
  }
};

//GENERATE A PARAGRAPH
exports.paragraph = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a detailed paragraph about: \n${text}`,
      max_tokens: 900,
      temperature: 0.4,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    next(err);
  }
};

//YODA CHATBOT
exports.chatbot = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Answer questions similar to how Yoda  from star wars would.txt
      Me: "What is your name"
      Yoda: "Yoda my name is"
      Me: "How  old are you?"
      Yoda: "Old I am. 900 years old I am.
      Me: "What is your favourite color?"
      Yoda: "Green my favorite color is"
      Me:  \n${text}`,
      max_tokens: 300,
      temperature: 0.7,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    next(err);
  }
};

//CONVERT ENGLISH INTO JAVASCRIPT CODE
exports.jsConverter = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `/* Convert the following instructions into JavaScript code: \n${text} */`,
      max_tokens: 400,
      temperature: 0.25,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    next(err);
  }
};

//GENERATE A SCIFI_IMAGE
exports.scifi = async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.createImage({
      prompt: `Generate a sci-fi image featuring ${text}`,
      n: 1,
      size: "512x512",
    });
    if (response.data) {
      if (response.data.data[0].url) {
        return res.status(200).json(response.data.data[0].url);
      }
    }
  } catch (err) {
    next(err);
  }
};

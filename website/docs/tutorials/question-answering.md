---
id: question-answering
sidebar_position: 3
---

# Question Answering

## Prerequisites

* [Install PyTorch Live CLI](install-cli)

## Initialize New Project

Let's start by initializing a new project `QuestionAnsweringTutorial` with the PyTorch Live CLI.

```shell
npx torchlive-cli init QuestionAnsweringTutorial
```

:::note

The project init can take a few minutes depending on your internet connection and your machine.

:::

After completion, navigate to the `QuestionAnsweringTutorial` directory created by the `init` command.

```shell
cd QuestionAnsweringTutorial
```

### Run the project in the emulator

Run the QuestionAnsweringTutorial project in the Android emulator with the PyTorch Live CLI. The `run-android` command will start the Android emulator, build, deploy, and run the app. The app is named PyTorch Live Example.

```shell
npx torchlive-cli run-android
```

![](/img/tutorial/question_answering_tutorial1.png "The PyTorch Live app running in a virtual device emulator")

:::tip

Keep the app open and running! Any code change will immediately be reflected after saving.

:::

## Question Answering Demo

Let's get started with the UI for the question answering. Create a file `QuestionAnsweringDemo.tsx` in `./src/demos`, copy and paste the code below, and save the file. The initial code creates a component rendering two text inputs, a button, and a text with `Question Answering`.

```tsx title="./src/demos/QuestionAnsweringDemo.tsx"
import * as React from 'react';
import {Button, Text, TextInput, View} from 'react-native';

export default function QuestionAnsweringDemo() {
  return (
    <View>
      <TextInput placeholder="Text" />
      <TextInput placeholder="Question" />
      <Button title="Ask" onPress={() => {}} />
      <Text>Question Answering</Text>
    </View>
  );
}
```

### Add Question Answering Demo to demos list

For the `QuestionAnsweringDemo` component to render in the `QuestionAnsweringTutorial` app, add it to the `MyDemos` component.

:::note

The `MyDemos.tsx` already contains code. Replace the code with the code below.

:::

```tsx title="./src/demos/MyDemos.tsx"
import * as React from 'react';
import QuestionAnsweringDemo from './QuestionAnsweringDemo';

export default function MyDemos() {
  return (
    <QuestionAnsweringDemo />
  );
}
```

![](/img/tutorial/question_answering_tutorial2.png)

:::caution

Tap on the "My Demos" tab to view your changes.

:::

### Style the component

Great! Next, add some styling to the question answering component.

```tsx {2,6-8,10,15-25} title="./src/demos/QuestionAnsweringDemo.tsx"
import * as React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

export default function QuestionAnsweringDemo() {
  return (
    <View style={styles.container}>
      <TextInput style={[styles.item, styles.input]} multiline={true} placeholder="Text" />
      <TextInput style={[styles.item, styles.input]} placeholder="Question" />
      <Button title="Ask" onPress={() => {}} />
      <Text style={styles.item}>Question Answering</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    margin: 10,
  },
  input: {
    borderWidth: 1,
  }
});
```

![](/img/tutorial/question_answering_tutorial3.png)

### Add state and event handler

Add state to the text inputs. React provides the `useState` hook to save component state. A `useState` hook returns an array with two items (or tuple). The first item (index `0`) is the current state and the second item (index `1`) is the set state function to update the state. In this change, it uses two `useState` hooks, one for the `text` state and one for the `question` state.

Add an event handler to the `Ask` button. The event handler `handleAsk` will be called when the button is pressed and log the `text` state and `question` state to the console (i.e., it will log what is typed into the text inputs).

```tsx {6-14,18-20} title="./src/demos/QuestionAnsweringDemo.tsx"
import * as React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

export default function QuestionAnsweringDemo() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');

  function handleAsk() {
    console.log({
      text,
      question,
    });
  }

  return (
    <View style={styles.container}>
      <TextInput style={[styles.item, styles.input]} placeholder="Text" multiline={true} value={text} onChangeText={setText} />
      <TextInput style={[styles.item, styles.input]} placeholder="Question" value={question} onChangeText={setQuestion} />
      <Button title="Ask" onPress={handleAsk} />
      <Text style={styles.item}>Question Answering</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    margin: 10,
  },
  input: {
    borderWidth: 1,
  }
});
```

Type into both text inputs, click the `Ask` button, and check logged output in terminal.

![](/img/tutorial/question_answering_tutorial4.png)

### Run model inference

Fantastic! Now use the `useNLPQAModelInference` hook to run inference on the `text` and `question`. The hook provides a `processQA` function and an `answer`. Replace the `console.log` with the `processQA` function and pass in the `text` and `question`. When the inference finishes, the component re-renders with the answer set as content of the `Text` component.

It will use the `bert_qa.pt` model that is already prepared for PyTorch Live. You can follow the [Prepare Custom Model](prepare-custom-model) tutorial to prepare your own NLP model and use this model instead for question answering.

```tsx {2,4-5,7-10,15-18,21,29} title="./src/demos/QuestionAnsweringDemo.tsx"
import * as React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {ModelInfo} from '../Models';
import useNLPQAModelInference from '../useNLPQAModelInference';

const modelInfo: ModelInfo = {
  name: 'Bert Q&A',
  model: require('../../models/bert_qa.pt'),
}

export default function QuestionAnsweringDemo() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const {
    answer,
    processQA,
  } = useNLPQAModelInference(modelInfo);

  function handleAsk() {
    processQA(text, question);
  }

  return (
    <View style={styles.container}>
      <TextInput style={[styles.item, styles.input]} placeholder="Text" multiline={true} value={text} onChangeText={setText} />
      <TextInput style={[styles.item, styles.input]} placeholder="Question" value={question} onChangeText={setQuestion} />
      <Button title="Ask" onPress={handleAsk} />
      <Text style={styles.item}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    margin: 10,
  },
  input: {
    borderWidth: 1,
  }
});
```

![](/img/tutorial/question_answering_tutorial5.png)

### Add user feedback

Add user feedback while the inference is running. The `useNLPQAModelInference` hook also provides an `isProcessing` state which is `true` when the inference is running and `false` otherwise. The `isProcessing` is used to render "Looking for the answer" while the model inference is running and it will render the answer when it is done.

```tsx {17,30} title="./src/demos/QuestionAnsweringDemo.tsx"
import * as React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {ModelInfo} from '../Models';
import useNLPQAModelInference from '../useNLPQAModelInference';

const modelInfo: ModelInfo = {
  name: 'Bert Q&A',
  model: require('../../models/bert_qa.pt'),
}

export default function QuestionAnsweringDemo() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const {
    answer,
    isProcessing,
    processQA,
  } = useNLPQAModelInference(modelInfo);

  function handleAsk() {
    processQA(text, question);
  }

  return (
    <View style={styles.container}>
      <TextInput style={[styles.item, styles.input]} placeholder="Text" multiline={true} value={text} onChangeText={setText} />
      <TextInput style={[styles.item, styles.input]} placeholder="Question" value={question} onChangeText={setQuestion} />
      <Button title="Ask" onPress={handleAsk} />
      <Text style={styles.item}>{isProcessing ? "Looking for the answer" : answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    margin: 10,
  },
  input: {
    borderWidth: 1,
  }
});
```

![](/img/tutorial/question_answering_tutorial6.png) ![](/img/tutorial/question_answering_tutorial5.png)

(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[920],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return d},kt:function(){return m}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,d=r(e,["components","mdxType","originalType","parentName"]),p=c(n),m=i,h=p["".concat(l,".").concat(m)]||p[m]||u[m]||o;return n?a.createElement(h,s(s({ref:t},d),{},{components:n})):a.createElement(h,s({ref:t},d))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,s=new Array(o);s[0]=p;var r={};for(var l in t)hasOwnProperty.call(t,l)&&(r[l]=t[l]);r.originalType=e,r.mdxType="string"==typeof e?e:i,s[1]=r;for(var c=2;c<o;c++)s[c]=n[c];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){"use strict";var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,i=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:i},t)}},1395:function(e,t,n){"use strict";n.d(t,{Z:function(){return d}});var a=n(7294),i=n(944),o=n(6010),s="tabItem_1uMI",r="tabItemActive_2DSg";var l=37,c=39;var d=function(e){var t=e.lazy,n=e.block,d=e.defaultValue,u=e.values,p=e.groupId,m=e.className,h=(0,i.Z)(),f=h.tabGroupChoices,g=h.setTabGroupChoices,k=(0,a.useState)(d),v=k[0],w=k[1],y=a.Children.toArray(e.children),x=[];if(null!=p){var N=f[p];null!=N&&N!==v&&u.some((function(e){return e.value===N}))&&w(N)}var b=function(e){var t=e.currentTarget,n=x.indexOf(t),a=u[n].value;w(a),null!=p&&(g(p,a),setTimeout((function(){var e,n,a,i,o,s,l,c;(e=t.getBoundingClientRect(),n=e.top,a=e.left,i=e.bottom,o=e.right,s=window,l=s.innerHeight,c=s.innerWidth,n>=0&&o<=c&&i<=l&&a>=0)||(t.scrollIntoView({block:"center",behavior:"smooth"}),t.classList.add(r),setTimeout((function(){return t.classList.remove(r)}),2e3))}),150))},T=function(e){var t,n;switch(e.keyCode){case c:var a=x.indexOf(e.target)+1;n=x[a]||x[0];break;case l:var i=x.indexOf(e.target)-1;n=x[i]||x[x.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},m)},u.map((function(e){var t=e.value,n=e.label;return a.createElement("li",{role:"tab",tabIndex:v===t?0:-1,"aria-selected":v===t,className:(0,o.Z)("tabs__item",s,{"tabs__item--active":v===t}),key:t,ref:function(e){return x.push(e)},onKeyDown:T,onFocus:b,onClick:b},n)}))),t?(0,a.cloneElement)(y.filter((function(e){return e.props.value===v}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},y.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==v})}))))}},9443:function(e,t,n){"use strict";var a=(0,n(7294).createContext)(void 0);t.Z=a},944:function(e,t,n){"use strict";var a=n(7294),i=n(9443);t.Z=function(){var e=(0,a.useContext)(i.Z);if(null==e)throw new Error("`useUserPreferencesContext` is used outside of `Layout` Component.");return e}},9435:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var a=n(7294),i="surveyLinkBox_YpLv";function o(e){var t="https://docs.google.com/forms/d/e/1FAIpQLScsB21xJWM_VANad5GcVkQqKB_BptS77axbunzs7ZkwoE5JUw/viewform?usp=pp_url&entry.1880917601="+e.docTitle.replace(/\s/g,"+");return a.createElement("a",{href:t,target:"_blank"},a.createElement("div",{className:i},"Share what we can improve!"))}},395:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return d},metadata:function(){return u},toc:function(){return p},default:function(){return h}});var a=n(2122),i=n(9756),o=(n(7294),n(3905)),s=n(1395),r=n(8215),l=n(9435),c=["components"],d={id:"question-answering",sidebar_position:3},u={unversionedId:"tutorials/question-answering",id:"tutorials/question-answering",isDocsHomePage:!1,title:"Question Answering",description:"In this tutorial, you will integrate an on-device NLP (Natural Language Processing) model that can answer questions about a short paragraph of text.",source:"@site/docs/tutorials/question-answering.mdx",sourceDirName:"tutorials",slug:"/tutorials/question-answering",permalink:"/docs/tutorials/question-answering",editUrl:"https://github.com/pytorch/live/edit/main/website/docs/tutorials/question-answering.mdx",version:"current",sidebarPosition:3,frontMatter:{id:"question-answering",sidebar_position:3},sidebar:"docs",previous:{title:"Image Classification",permalink:"/docs/tutorials/image-classification"},next:{title:"MNIST Digit Classification",permalink:"/docs/tutorials/mnist-digit-classification"}},p=[{value:"In this tutorial, you will integrate an on-device NLP (Natural Language Processing) model that can answer questions about a short paragraph of text.",id:"in-this-tutorial-you-will-integrate-an-on-device-nlp-natural-language-processing-model-that-can-answer-questions-about-a-short-paragraph-of-text",children:[]},{value:"Initialize New Project",id:"initialize-new-project",children:[{value:"Run the project in the Android emulator or iOS Simulator",id:"run-the-project-in-the-android-emulator-or-ios-simulator",children:[]}]},{value:"Question Answering Demo",id:"question-answering-demo",children:[{value:"Style the component",id:"style-the-component",children:[]},{value:"Add state and event handler",id:"add-state-and-event-handler",children:[]},{value:"Run model inference",id:"run-model-inference",children:[]},{value:"Show the answer",id:"show-the-answer",children:[]},{value:"Add user feedback",id:"add-user-feedback",children:[]}]},{value:"Give us feedback",id:"give-us-feedback",children:[]}],m={toc:p};function h(e){var t=e.components,d=(0,i.Z)(e,c);return(0,o.kt)("wrapper",(0,a.Z)({},m,d,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("div",{className:"tutorial-page"},(0,o.kt)("h3",{id:"in-this-tutorial-you-will-integrate-an-on-device-nlp-natural-language-processing-model-that-can-answer-questions-about-a-short-paragraph-of-text"},"In this tutorial, you will integrate an on-device NLP (Natural Language Processing) model that can answer questions about a short paragraph of text."),(0,o.kt)("p",null,"If you haven't installed the PyTorch Live CLI yet, please ",(0,o.kt)("a",{parentName:"p",href:"get-started"},"follow this tutorial")," to get started."),(0,o.kt)("p",null,"If you get lost at any point in this tutorial, completed examples of each step can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/pytorch/live/tree/main/examples/question-answering/"},"here"),"."),(0,o.kt)("h2",{id:"initialize-new-project"},"Initialize New Project"),(0,o.kt)("p",null,"Let's start by initializing a new project ",(0,o.kt)("inlineCode",{parentName:"p"},"QuestionAnsweringTutorial")," with the PyTorch Live CLI."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npx torchlive-cli init QuestionAnsweringTutorial\n")),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"The project init can take a few minutes depending on your internet connection and your computer."))),(0,o.kt)("p",null,"After completion, navigate to the ",(0,o.kt)("inlineCode",{parentName:"p"},"QuestionAnsweringTutorial")," directory created by the ",(0,o.kt)("inlineCode",{parentName:"p"},"init")," command."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"cd QuestionAnsweringTutorial\n")),(0,o.kt)("h3",{id:"run-the-project-in-the-android-emulator-or-ios-simulator"},"Run the project in the Android emulator or iOS Simulator"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"run-android")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"run-ios")," commands from the PyTorch Live CLI allow you to run the question answering project in the Android emulator or iOS Simulator."),(0,o.kt)(s.Z,{defaultValue:"android",values:[{label:"Android",value:"android"},{label:"iOS (Simulator)",value:"ios-sim"}],mdxType:"Tabs"},(0,o.kt)(r.Z,{value:"android",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npx torchlive-cli run-android\n")),(0,o.kt)("p",null,"  The app will deploy and run on your physical Android device if it is connected to your computer via USB, and it is in developer mode. There are more details on that in the ",(0,o.kt)("a",{parentName:"p",href:"get-started"},"Get Started tutorial"),"."),(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(9354).Z,title:"Screenshot of app after fresh init with CLI"}))),(0,o.kt)(r.Z,{value:"ios-sim",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npx torchlive-cli run-ios\n")),(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(2003).Z,title:"Screenshot of app after fresh init with CLI"})))),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Keep the app open and running! Any code change will immediately be reflected after saving."))),(0,o.kt)("h2",{id:"question-answering-demo"},"Question Answering Demo"),(0,o.kt)("p",null,"Let's get started with the UI for the question answering. Go ahead and start by copying the following code into the file ",(0,o.kt)("inlineCode",{parentName:"p"},"src/demos/MyDemos.tsx"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="./src/demos/MyDemos.tsx"',title:'"./src/demos/MyDemos.tsx"'},"import * as React from 'react';\nimport {Button, Text, TextInput, View} from 'react-native';\nimport {useSafeAreaInsets} from 'react-native-safe-area-context';\n\nexport default function QuestionAnsweringDemo() {\n  // Get safe area insets to account for notches, etc.\n  const insets = useSafeAreaInsets();\n  return (\n    <View style={{marginTop: insets.top, marginBottom: insets.bottom}}>\n      <TextInput placeholder=\"Text\" />\n      <TextInput placeholder=\"Question\" />\n      <Button title=\"Ask\" onPress={() => {}} />\n      <Text>Question Answering</Text>\n    </View>\n  );\n}\n")),(0,o.kt)("p",null,"The initial code creates a component rendering two text inputs, a button, and a text with ",(0,o.kt)("inlineCode",{parentName:"p"},"Question Answering"),"."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"The ",(0,o.kt)("inlineCode",{parentName:"p"},"MyDemos.tsx")," already contains code. Replace the code with the code below."))),(0,o.kt)(s.Z,{defaultValue:"android",values:[{label:"Android",value:"android"},{label:"iOS (Simulator)",value:"ios-sim"}],mdxType:"Tabs"},(0,o.kt)(r.Z,{value:"android",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(105).Z,title:"Screenshot of initial user interface"}))),(0,o.kt)(r.Z,{value:"ios-sim",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(6242).Z,title:"Screenshot of initial user interface"})))),(0,o.kt)("h3",{id:"style-the-component"},"Style the component"),(0,o.kt)("p",null,"Great! Let's, add some basic styling to the app UI. The styles will add a padding of ",(0,o.kt)("inlineCode",{parentName:"p"},"10")," pixels for the container ",(0,o.kt)("inlineCode",{parentName:"p"},"View")," component. It will also add padding and margin to the ",(0,o.kt)("inlineCode",{parentName:"p"},"TextInput")," components, the ask ",(0,o.kt)("inlineCode",{parentName:"p"},"Button")," and the output ",(0,o.kt)("inlineCode",{parentName:"p"},"Text"),", so they aren't squeezed together."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="./src/demos/MyDemos.tsx"',title:'"./src/demos/MyDemos.tsx"'},'import * as React from \'react\';\nimport {Button, StyleSheet, Text, TextInput, View} from \'react-native\';\nimport {useSafeAreaInsets} from \'react-native-safe-area-context\';\n\nexport default function QuestionAnsweringDemo() {\n  // Get safe area insets to account for notches, etc.\n  const insets = useSafeAreaInsets();\n  return (\n    <View style={[styles.container, {marginTop: insets.top, marginBottom: insets.bottom}]}>\n      <TextInput style={[styles.item, styles.input]} multiline={true} placeholder="Text" placeholderTextColor="#CCC" />\n      <TextInput style={[styles.item, styles.input]} placeholder="Question" placeholderTextColor="#CCC" />\n      <Button title="Ask" onPress={() => {}} />\n      <Text style={styles.item}>Question Answering</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    padding: 10,\n  },\n  item: {\n    margin: 10,\n    padding: 10,\n  },\n  input: {\n    borderWidth: 1,\n    color: \'#000\',\n  }\n});\n')),(0,o.kt)(s.Z,{defaultValue:"android",values:[{label:"Android",value:"android"},{label:"iOS (Simulator)",value:"ios-sim"}],mdxType:"Tabs"},(0,o.kt)(r.Z,{value:"android",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(8442).Z,title:"Screenshot after applying simple component styles"}))),(0,o.kt)(r.Z,{value:"ios-sim",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(2658).Z,title:"Screenshot after applying simple component styles"})))),(0,o.kt)("h3",{id:"add-state-and-event-handler"},"Add state and event handler"),(0,o.kt)("p",null,"Next, add state to the text inputs, to keep track of the input content. React provides the ",(0,o.kt)("inlineCode",{parentName:"p"},"useState")," hook to save component state. A ",(0,o.kt)("inlineCode",{parentName:"p"},"useState")," hook returns an array with two items (or tuple). The first item (index ",(0,o.kt)("inlineCode",{parentName:"p"},"0"),") is the current state and the second item (index ",(0,o.kt)("inlineCode",{parentName:"p"},"1"),") is the set state function to update the state. In this change, it uses two ",(0,o.kt)("inlineCode",{parentName:"p"},"useState")," hooks, one for the ",(0,o.kt)("inlineCode",{parentName:"p"},"text")," state and one for the ",(0,o.kt)("inlineCode",{parentName:"p"},"question")," state."),(0,o.kt)("p",null,"Add an event handler to the ",(0,o.kt)("inlineCode",{parentName:"p"},"Ask")," button. The event handler ",(0,o.kt)("inlineCode",{parentName:"p"},"handleAsk")," will be called when the button is pressed. For testing, let's log the ",(0,o.kt)("inlineCode",{parentName:"p"},"text")," state and ",(0,o.kt)("inlineCode",{parentName:"p"},"question")," state to the console (i.e., it will log what is typed into the text inputs)."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="./src/demos/MyDemos.tsx"',title:'"./src/demos/MyDemos.tsx"'},"import * as React from 'react';\nimport {useState} from 'react';\nimport {Button, StyleSheet, Text, TextInput, View} from 'react-native';\nimport {useSafeAreaInsets} from 'react-native-safe-area-context';\n\nexport default function QuestionAnsweringDemo() {\n  // Get safe area insets to account for notches, etc.\n  const insets = useSafeAreaInsets();\n\n  const [text, setText] = useState('');\n  const [question, setQuestion] = useState('');\n\n  async function handleAsk() {\n    console.log({\n      text,\n      question,\n    });\n  }\n\n  return (\n    <View style={[styles.container, {marginTop: insets.top, marginBottom: insets.bottom}]}>\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Text\" placeholderTextColor=\"#CCC\" multiline={true} value={text} onChangeText={setText} />\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Question\" placeholderTextColor=\"#CCC\" value={question} onChangeText={setQuestion} />\n      <Button title=\"Ask\" onPress={handleAsk} />\n      <Text style={styles.item}>Question Answering</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    padding: 10,\n  },\n  item: {\n    margin: 10,\n    padding: 10,\n  },\n  input: {\n    borderWidth: 1,\n    color: '#000',\n  }\n});\n")),(0,o.kt)(s.Z,{defaultValue:"android",values:[{label:"Android",value:"android"},{label:"iOS (Simulator)",value:"ios-sim"}],mdxType:"Tabs"},(0,o.kt)(r.Z,{value:"android",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(222).Z,title:"Screenshot event handler and more styling"}))),(0,o.kt)(r.Z,{value:"ios-sim",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(3170).Z,title:"Screenshot event handler and more styling"})))),(0,o.kt)("p",null,"Type into both text inputs, click the ",(0,o.kt)("inlineCode",{parentName:"p"},"Ask")," button, and check logged output in terminal."),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(4882).Z})),(0,o.kt)("h3",{id:"run-model-inference"},"Run model inference"),(0,o.kt)("p",null,"Fantastic! Now let's use the text and question and run inference on a question answering model."),(0,o.kt)("p",null,"We'll require the Distilbert SQuAD model (i.e., ",(0,o.kt)("inlineCode",{parentName:"p"},"bert_qa.ptl"),") and add the ",(0,o.kt)("inlineCode",{parentName:"p"},"QuestionAnsweringResult")," type for type-safety. Then, we call the ",(0,o.kt)("inlineCode",{parentName:"p"},"execute")," function on the ",(0,o.kt)("inlineCode",{parentName:"p"},"MobileModel")," object with the model as first argument and an object with the ",(0,o.kt)("inlineCode",{parentName:"p"},"text")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"question")," and the ",(0,o.kt)("inlineCode",{parentName:"p"},"modelInputLength")," second argument."),(0,o.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"The ",(0,o.kt)("inlineCode",{parentName:"p"},"text")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"question")," states are concatenated into a sequence including two special tokens ",(0,o.kt)("inlineCode",{parentName:"p"},"[CLS]")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"[SEP]"),". This sequence format is how the model was trained and is expected as input. The first\ntoken of every sequence is always a special classification token (i.e., ",(0,o.kt)("inlineCode",{parentName:"p"},"[CLS]"),"). Sentence pairs are packed together into a single sequence put between a special separator token (i.e., ",(0,o.kt)("inlineCode",{parentName:"p"},"[SEP]"),"). A sequence ends with a ",(0,o.kt)("inlineCode",{parentName:"p"},"[SEP]")," token."),(0,o.kt)("p",{parentName:"div"},"The ",(0,o.kt)("inlineCode",{parentName:"p"},"modelInputLength")," defines the max token size. Simply speaking, an ML model works with numbers (i.e., tensors), so the sequence has to be converted into numbers. This is handled by PyTorch Live transparently. The ",(0,o.kt)("inlineCode",{parentName:"p"},"bert_qa.ptl"),' model uses a subword-based tokenizer to split words into smaller subwords that are mapped to numbers using a dictionary. For example, the word "hello" is first tokenized into the two tokens "hell" and "##o", and then both tokens are looked up in a pre-defined vocabulary that maps tokens to numbers. In consequence the word, "hello" is based on two tokens.'),(0,o.kt)("p",{parentName:"div"},"Note that ",(0,o.kt)("inlineCode",{parentName:"p"},"360")," is the maximum token size for the ",(0,o.kt)("inlineCode",{parentName:"p"},"text")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"question")," (and the three special tokens). It may be faster to reduce the ",(0,o.kt)("inlineCode",{parentName:"p"},"modelInputLength")," to less than ",(0,o.kt)("inlineCode",{parentName:"p"},"360")," if it is known that the use case works with short sequences."))),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"It will use the ",(0,o.kt)("inlineCode",{parentName:"p"},"bert_qa.ptl")," model that is already prepared for PyTorch Live. You can follow the ",(0,o.kt)("a",{parentName:"p",href:"prepare-custom-model"},"Prepare Custom Model")," tutorial to prepare your own NLP model and use this model instead for question answering."))),(0,o.kt)("p",null,"Don't forget the ",(0,o.kt)("inlineCode",{parentName:"p"},"await")," keyword for the ",(0,o.kt)("inlineCode",{parentName:"p"},"MobileModel.execute")," function call!"),(0,o.kt)("p",null,"Last, let's log the inference result to the console."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="./src/demos/MyDemos.tsx"',title:'"./src/demos/MyDemos.tsx"'},"import * as React from 'react';\nimport {useState} from 'react';\nimport {Button, StyleSheet, Text, TextInput, View} from 'react-native';\nimport {MobileModel} from 'react-native-pytorch-core';\nimport {useSafeAreaInsets} from 'react-native-safe-area-context';\n\nconst model = require('../../models/bert_qa.ptl');\n\ntype QuestionAnsweringResult = {\n  answer: string;\n}\n\nexport default function QuestionAnsweringDemo() {\n  // Get safe area insets to account for notches, etc.\n  const insets = useSafeAreaInsets();\n\n  const [text, setText] = useState('');\n  const [question, setQuestion] = useState('');\n\n  async function handleAsk() {\n    const qaText = `[CLS] ${question} [SEP] ${text} [SEP]`;\n\n    const inferenceResult = await MobileModel.execute<QuestionAnsweringResult>(model, {\n      text: qaText,\n      modelInputLength: 360,\n    });\n\n    // Log model inference result to Metro console\n    console.log(inferenceResult);\n  }\n\n  return (\n    <View style={[styles.container, {marginTop: insets.top, marginBottom: insets.bottom}]}>\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Text\" placeholderTextColor=\"#CCC\" multiline={true} value={text} onChangeText={setText} />\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Question\" placeholderTextColor=\"#CCC\" value={question} onChangeText={setQuestion} />\n      <Button title=\"Ask\" onPress={handleAsk} />\n      <Text style={styles.item}>Question Answering</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    padding: 10,\n  },\n  item: {\n    margin: 10,\n    padding: 10,\n  },\n  input: {\n    borderWidth: 1,\n    color: '#000',\n  }\n});\n")),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(6450).Z})),(0,o.kt)("p",null,"The logged inference result is a JavaScript object containing the inference result including the ",(0,o.kt)("inlineCode",{parentName:"p"},"answer")," and inference metrics (i.e., inference time, pack time, unpack time, and total time)."),(0,o.kt)("p",null,"Can you guess what the ",(0,o.kt)("inlineCode",{parentName:"p"},"text")," was for the returned ",(0,o.kt)("inlineCode",{parentName:"p"},"answer"),"?"),(0,o.kt)("h3",{id:"show-the-answer"},"Show the answer"),(0,o.kt)("p",null,"Ok! So, we have an ",(0,o.kt)("inlineCode",{parentName:"p"},"answer"),". Instead of having the end-user looking at a console log, we will render the answer in the app. We'll add a state for the ",(0,o.kt)("inlineCode",{parentName:"p"},"answer")," using a React Hook, and when an answer is returned, we'll set it using the ",(0,o.kt)("inlineCode",{parentName:"p"},"setAnswer")," function."),(0,o.kt)("p",null,"The user interface will automatically re-render whenever the ",(0,o.kt)("inlineCode",{parentName:"p"},"setAnswer")," function is called with a new value, so you don't have to worry about calling anything else besides this function. On re-render, the ",(0,o.kt)("inlineCode",{parentName:"p"},"answer")," variable will have this new value, so we can use it to render it on the screen."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"The ",(0,o.kt)("inlineCode",{parentName:"p"},"React.useState")," is a React Hook. Hooks allow React function components, like our ",(0,o.kt)("inlineCode",{parentName:"p"},"QuestionAnsweringDemo")," function component, to remember things."),(0,o.kt)("p",{parentName:"div"},"For more information on ",(0,o.kt)("a",{parentName:"p",href:"https://reactjs.org/docs/hooks-intro.html"},"React Hooks"),", head over to the React docs where you can read or watch explanations."))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="./src/demos/MyDemos.tsx"',title:'"./src/demos/MyDemos.tsx"'},"import * as React from 'react';\nimport {useState} from 'react';\nimport {Button, StyleSheet, Text, TextInput, View} from 'react-native';\nimport {MobileModel} from 'react-native-pytorch-core';\nimport {useSafeAreaInsets} from 'react-native-safe-area-context';\n\nconst model = require('../../models/bert_qa.ptl');\n\ntype QuestionAnsweringResult = {\n  answer: string;\n}\n\nexport default function QuestionAnsweringDemo() {\n  // Get safe area insets to account for notches, etc.\n  const insets = useSafeAreaInsets();\n\n  const [text, setText] = useState('');\n  const [question, setQuestion] = useState('');\n  const [answer, setAnswer] = useState('');\n\n  async function handleAsk() {\n    const qaText = `[CLS] ${question} [SEP] ${text} [SEP]`;\n\n    const {result} = await MobileModel.execute<QuestionAnsweringResult>(model, {\n      text: qaText,\n      modelInputLength: 360,\n    });\n\n    // No answer found if the answer is null\n    if (result.answer == null) {\n      setAnswer('No answer found');\n    } else {\n      setAnswer(result.answer);\n    }\n  }\n\n  return (\n    <View style={[styles.container, {marginTop: insets.top, marginBottom: insets.bottom}]}>\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Text\" placeholderTextColor=\"#CCC\" multiline={true} value={text} onChangeText={setText} />\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Question\" placeholderTextColor=\"#CCC\" value={question} onChangeText={setQuestion} />\n      <Button title=\"Ask\" onPress={handleAsk} />\n      <Text style={styles.item}>{answer}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    padding: 10,\n  },\n  item: {\n    margin: 10,\n    padding: 10,\n  },\n  input: {\n    borderWidth: 1,\n    color: '#000',\n  }\n});\n")),(0,o.kt)(s.Z,{defaultValue:"android",values:[{label:"Android",value:"android"},{label:"iOS (Simulator)",value:"ios-sim"}],mdxType:"Tabs"},(0,o.kt)(r.Z,{value:"android",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(857).Z,title:"Screenshot of question answering inference result"}))),(0,o.kt)(r.Z,{value:"ios-sim",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(467).Z,title:"Screenshot of question answering inference result"})))),(0,o.kt)("p",null,"It looks like the model correctly answered the question!"),(0,o.kt)("h3",{id:"add-user-feedback"},"Add user feedback"),(0,o.kt)("p",null,"It can take a few milliseconds for the model to return the answer. Let's add a ",(0,o.kt)("inlineCode",{parentName:"p"},"isProcessing"),"  state which is ",(0,o.kt)("inlineCode",{parentName:"p"},"true")," when the inference is running and ",(0,o.kt)("inlineCode",{parentName:"p"},"false")," otherwise. The ",(0,o.kt)("inlineCode",{parentName:"p"},"isProcessing"),' is used to render "Looking for the answer" while the model inference is running and it will render the answer when it is done.'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="./src/demos/MyDemos.tsx"',title:'"./src/demos/MyDemos.tsx"'},"import * as React from 'react';\nimport {useState} from 'react';\nimport {Button, StyleSheet, Text, TextInput, View} from 'react-native';\nimport {MobileModel} from 'react-native-pytorch-core';\nimport {useSafeAreaInsets} from 'react-native-safe-area-context';\n\nconst model = require('../../models/bert_qa.ptl');\n\ntype QuestionAnsweringResult = {\n  answer: string;\n}\n\nexport default function QuestionAnsweringDemo() {\n  // Get safe area insets to account for notches, etc.\n  const insets = useSafeAreaInsets();\n\n  const [text, setText] = useState('');\n  const [question, setQuestion] = useState('');\n  const [answer, setAnswer] = useState('');\n  const [isProcessing, setIsProcessing] = useState(false);\n\n  async function handleAsk() {\n    setIsProcessing(true);\n\n    const qaText = `[CLS] ${question} [SEP] ${text} [SEP]`;\n\n    const {result} = await MobileModel.execute<QuestionAnsweringResult>(model, {\n      text: qaText,\n      modelInputLength: 360,\n    });\n\n    // No answer found if the answer is null\n    if (result.answer == null) {\n      setAnswer('No answer found');\n    } else {\n      setAnswer(result.answer);\n    }\n\n    setIsProcessing(false);\n  }\n\n  return (\n    <View style={[styles.container, {marginTop: insets.top, marginBottom: insets.bottom}]}>\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Text\" placeholderTextColor=\"#CCC\" multiline={true} value={text} onChangeText={setText} />\n      <TextInput style={[styles.item, styles.input]} placeholder=\"Question\" placeholderTextColor=\"#CCC\" value={question} onChangeText={setQuestion} />\n      <Button title=\"Ask\" onPress={handleAsk} />\n      <Text style={styles.item}>{isProcessing ? \"Looking for the answer\" : answer}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    padding: 10,\n  },\n  item: {\n    margin: 10,\n    padding: 10,\n  },\n  input: {\n    borderWidth: 1,\n    color: '#000',\n  }\n});\n")),(0,o.kt)(s.Z,{defaultValue:"android",values:[{label:"Android",value:"android"},{label:"iOS",value:"ios"}],mdxType:"Tabs"},(0,o.kt)(r.Z,{value:"android",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(2176).Z,title:"Screenshot for showing question answering with user feedback"}))),(0,o.kt)(r.Z,{value:"ios",mdxType:"TabItem"},(0,o.kt)("p",null,"  ",(0,o.kt)("img",{src:n(6959).Z,title:"Screenshot for showing question answering with user feedback"})))),(0,o.kt)("h2",{id:"give-us-feedback"},"Give us feedback"),(0,o.kt)(l.Z,{docTitle:"Question Answering",mdxType:"SurveyLinkButton"})))}h.isMDXComponent=!0},6010:function(e,t,n){"use strict";function a(e){var t,n,i="";if("string"==typeof e||"number"==typeof e)i+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=a(e[t]))&&(i&&(i+=" "),i+=n);else for(t in e)e[t]&&(i&&(i+=" "),i+=t);return i}function i(){for(var e,t,n=0,i="";n<arguments.length;)(e=arguments[n++])&&(t=a(e))&&(i&&(i+=" "),i+=t);return i}n.d(t,{Z:function(){return i}})},222:function(e,t,n){"use strict";t.Z=n.p+"assets/images/event-handler-and-more-style-7817b630ac776aa15b7917c758941864.png"},9354:function(e,t,n){"use strict";t.Z=n.p+"assets/images/first-run-25e23131120ec484ac24093ae32f4e52.png"},857:function(e,t,n){"use strict";t.Z=n.p+"assets/images/inference-example-deedcd7a376ee66f24fb837df8808014.png"},105:function(e,t,n){"use strict";t.Z=n.p+"assets/images/initial-ui-5faa23a05c2e3f82dbbcb21797ccb3d9.png"},8442:function(e,t,n){"use strict";t.Z=n.p+"assets/images/simple-styles-c5004d1b1132d0fb63dc327f3c29f904.png"},2176:function(e,t,n){"use strict";t.Z=n.p+"assets/images/user-feedback-8c24064fc4fd5a21130494d7b733d830.gif"},3170:function(e,t,n){"use strict";t.Z=n.p+"assets/images/event-handler-and-more-style-0df3f21715d368d9cb1cff59e28d3466.png"},2003:function(e,t,n){"use strict";t.Z=n.p+"assets/images/first-run-141ff37378121bc763a8a597ec83ab89.png"},467:function(e,t,n){"use strict";t.Z=n.p+"assets/images/inference-example-c89032a63be47faa556e497de62cd13a.png"},6242:function(e,t,n){"use strict";t.Z=n.p+"assets/images/initial-ui-c051a6e6aefe5b92fcddd8b40d3f3a75.png"},2658:function(e,t,n){"use strict";t.Z=n.p+"assets/images/simple-styles-a19afe68b3a1730521a1dcca1d217ae0.png"},6959:function(e,t,n){"use strict";t.Z=n.p+"assets/images/user-feedback-67b86e1ad8f28ac234068c2ccd4f5429.gif"},6450:function(e,t,n){"use strict";t.Z=n.p+"assets/images/metro-console-log-inference-result-b25e8c3d45d000e66a08eb04ac83867e.png"},4882:function(e,t,n){"use strict";t.Z=n.p+"assets/images/metro-console-log-2ad44f0f53e72e5eb45fce824285ca66.png"}}]);
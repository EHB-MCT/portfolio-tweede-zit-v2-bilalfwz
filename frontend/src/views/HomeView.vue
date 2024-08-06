<template>
  <main>
    <h1>Hello, {{ user.firstname }}</h1>
    <div class="text-center pa-4">
      <v-alert
        v-if="errorMessage != ''"
        color="error"
        title="Error happened"
        :text="errorMessage"
      ></v-alert>
      <v-btn @click="dialog = true">
        Ask question
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="50vw"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          title="Create a question"
        >
          <v-text-field v-model="question" clearable label="question"></v-text-field>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="submit"
              @click="postQuestion"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
      <v-expansion-panels v-for="question of questions">
          <v-expansion-panel
            :title="question.question"
          >
          <v-expansion-panel-text>
            <p>answers: </p>
            <v-list lines="one">
              <v-list-item
                v-for="answer of question.answers"
                :key="answer.id">
                <template v-slot title>
                  <div :class="answer.correct ? 'item correct' : 'item incorrect'">
                    <p> {{ answer.user.firstname }}: {{ answer.answer }} </p>
                    <div>
                      <v-btn size="small" color="success" v-if="user.id == question.askedby && !answer.correct" @click="updateQuestion(answer,true)">Correct</v-btn>
                      <v-btn size="small" color="error" v-if="user.id == question.askedby && answer.correct" @click="updateQuestion(answer, false)">Not correct</v-btn>
                    </div>
                  </div>
                </template>
            </v-list-item>
            </v-list>
            <p>comments: </p>
            <v-list lines="one">
              <v-list-item
                v-for="comment of question.comments"
                :key="comment.id">

                <template v-slot title>
                  <div class='item'>
                    <p> {{ comment.user.firstname }}: {{ comment.comment }} </p>
                  </div>
                </template>
              </v-list-item>
            </v-list>
            <v-text-field
                v-model="question.answerToPost"
                label="Post answer"
                flat
                solo>
                <template #append>
                    <v-btn
                        @click="postAnswer(question)"
                        color="success"
                        type="submit"
                        value="answer">
                    Answer
                    </v-btn>
                </template>
            </v-text-field>
            <v-text-field
                v-model="question.commentToPost"
                label="Post comment"
                flat
                solo>
                <template #append>
                    <v-btn
                        @click="postComment(question)"
                        color="success"
                        type="submit"
                        value="Post">
                    Post
                    </v-btn>
                </template>
            </v-text-field>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
  </main>
</template>

<script setup>
import { fetchQuestions, createQuestion, createComment, createAnswer, updateAnswerStatus } from '../api.js'
import { ref, onBeforeMount } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
let errorMessage = ref('')
let dialog = ref(false);
let questions = ref([]);
let question = ref("")
const user = useUserStore();

onBeforeMount( async () => {
  console.log("getting questions")
  questions.value = await fetchQuestions()
  console.log(user.id)
  console.log(questions.value)
})

async function postComment(question) {
  try {
    console.log(question)
    const result = await createComment(question.commentToPost, question.id, user.id);
    questions.value = await fetchQuestions();
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function postAnswer(question) {
  try {
    console.log(question)
    const result = await createAnswer(question.answerToPost, question.id, user.id)
    questions.value = await fetchQuestions();
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function postQuestion() {
  try {
    const result = await createQuestion(question.value, user.id)
    console.log(result);
    dialog.value = false;
    questions.value = await fetchQuestions();
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function updateQuestion(answer, correct){
  try {
    const result = await updateAnswerStatus(answer, correct);
    questions.value = await fetchQuestions();
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error.message
  }
}

</script>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
}

.correct {
  border: 1px solid green;
}
</style>
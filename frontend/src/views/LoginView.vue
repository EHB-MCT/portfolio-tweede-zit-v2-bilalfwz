<template>
    <main>
        <v-card class="mx-auto" width="500">
            <v-tabs
                v-model="tab"
                bg-color="primary"
            >
                <v-tab value="login">Log In</v-tab>
                <v-tab value="register">Register</v-tab>
            </v-tabs>

            <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="login">
                    <v-sheet class="mx-auto login-form" width="450">
                        <h1 class="title">Welcome to student forum</h1>
                        <v-alert
                            v-if="errorMessage != ''"
                            color="error"
                            title="Error happened"
                            :text="errorMessage"
                        ></v-alert>
                        <v-form @submit.prevent>
                            <v-text-field
                                v-model="username"
                                label="username"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                type="password"
                                label="Password"
                            ></v-text-field>
                            <v-btn @click="sendLogin" class="mt-2" type="submit" block>Log in</v-btn>
                        </v-form>
                    </v-sheet>
                </v-tabs-window-item>

                <v-tabs-window-item value="register">
                    <v-sheet class="mx-auto login-form" width="450">
                        <h1 class="title">Welcome to student forum</h1>
                        <v-alert
                            v-if="errorMessage != ''"
                            color="error"
                            title="Error happened"
                            :text="errorMessage"
                        ></v-alert>
                        <v-form @submit.prevent>
                            <v-text-field
                                v-model="firstname"
                                label="firstname"
                            ></v-text-field>
                            <v-text-field
                                v-model="lastname"
                                label="lastname"
                            ></v-text-field>
                            <v-text-field
                                v-model="email"
                                label="email"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                type="password"
                                label="Password"
                            ></v-text-field>
                            <v-btn @click="register" class="mt-2" type="submit" block>Register</v-btn>
                        </v-form>
                    </v-sheet>
                </v-tabs-window-item>
            </v-tabs-window>
            </v-card-text>
        </v-card>
    </main>
</template>

<script setup>
import { logIn, registerUser } from '../api.js'
import { ref, watch } from "vue";
import { useUserStore } from '@/stores/userStore.js'
import router from '@/router/index.js'
let errorMessage = ref('');
const tab = ref("")
const username = ref("");
const password = ref("")
const user = useUserStore()

const firstname = ref("")
const lastname = ref("")
const email = ref("")

console.log(user.state)   

watch(tab, (newValue, oldValue) => {
    // we need to reset some variables
    errorMessage.value = ""
    username.value = ""
    password.value = ""
    firstname.value = ""
    lastname.value = ""
    email.value = ""
});

async function sendLogin() {
    try {
        const result = await logIn(username.value, password.value);
        if (result) {
            console.log(result);
            user.logIn(result.firstname, result.lastname, result.email, result.id)
            router.push({name: 'home'})
        }
        errorMessage.value = ''
    } catch (error) {
        errorMessage.value = error.message;
    } 
}

async function register() {
    try {
        const result = await registerUser(firstname.value, lastname.value, email.value, password.value);
        if (result) {
            tab.value = 'login'
        }
        errorMessage.value = ''
    } catch (error) {
        errorMessage.value = error.message;
    }
}
</script>

<style>
.title {
    text-align: center;
}
.login-form {
    padding: 20px;
    border-radius: 5px !important;
}
</style>
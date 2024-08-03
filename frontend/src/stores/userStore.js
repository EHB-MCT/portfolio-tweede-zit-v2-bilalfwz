import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return { 
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        id: undefined,
        loggedIn: false
    }
  },
  actions: {
    logIn(firstname, lastname, email, id) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.id = id;
        this.loggedIn = true;
    },

    logOut() {
        this.loggedIn = false;
        this.firstname = undefined;
        this.lastname = undefined;
        this.email = undefined;
        this.id = undefined;
    }
  },
  persist: true
})
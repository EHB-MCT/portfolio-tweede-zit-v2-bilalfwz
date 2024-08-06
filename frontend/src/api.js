const BACKEND_URL = import.meta.env.VITE_API_URL;

async function logIn(email, password) {
    const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            "Content-Type": "Application/json"
        }
    });

    if (response.status === 200) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

async function fetchQuestions() {
    const response = await fetch(`${BACKEND_URL}/questions`);
    if (response.status === 200) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

async function createQuestion(question, askedBy) {
    const response = await fetch(`${BACKEND_URL}/questions`, {
        method: "POST",
        body: JSON.stringify({
            question,
            askedby: askedBy
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 201) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

async function registerUser(firstname, lastname, email, password) {
    const response = await fetch(`${BACKEND_URL}/users/register`, {
        method: "POST",
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 201) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

async function createAnswer(answer, questionId, answeredBy) {
    const response = await fetch(`${BACKEND_URL}/answers`, {
        method: "POST",
        body: JSON.stringify({
            answer,
            questionId,
            answeredBy,
            correct: false
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 201) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

async function createComment(comment, questionId, commentedBy) {
    const response = await fetch(`${BACKEND_URL}/comments`, {
        method: "POST",
        body: JSON.stringify({
            comment,
            questionId,
            commentedBy
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 201) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

async function updateAnswerStatus(answer, correct) {
    const prepend = correct ? 'correct' : 'incorrect';
    const response = await fetch(`${BACKEND_URL}/answers/${answer.id}/${prepend}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 200) {
        return await response.json()
    } else {
        throw new Error((await response.text()))
    }
}

export {
    logIn,
    fetchQuestions,
    registerUser, 
    createQuestion,
    createComment,
    createAnswer,
    updateAnswerStatus
}
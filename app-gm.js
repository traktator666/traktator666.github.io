const firebaseConfig = {
    apiKey: "AIzaSyBHy5e7vS-yPckC1VkvfhIQWaWKk9ir93Q",
    authDomain: "traktator666.firebaseapp.com",
    projectId: "traktator666",
    messagingSenderId: "1030789130385",
    appId: "1:1030789130385:web:b67f742de295c8e8197730"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  auth.signInAnonymously()
    .then(() => console.log("Авторизован анонимно"))
    .catch(console.error);
  
  // Для /gm/ используем коллекцию 'posts_gm'
  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    await db.collection('posts_gm').add({
      name: document.getElementById('name').value || 'Аноним',
      message: document.getElementById('message').value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    e.target.reset();
  });
  
  db.collection('posts_gm')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .onSnapshot(snapshot => {
      const threads = document.getElementById('threads');
      threads.innerHTML = '';
      
      snapshot.forEach(doc => {
        const post = doc.data();
        threads.innerHTML += `
          <div class="thread">
            <strong>${post.name}</strong>
            <p>${post.message}</p>
            <small>${new Date(post.createdAt?.seconds * 1000).toLocaleString()}</small>
          </div>
        `;
      });
    });
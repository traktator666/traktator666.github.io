// Конфиг Firebase (замените на свой!)
const firebaseConfig = {
    apiKey: "AIzaSyBHy5e7vS-yPckC1VkvfhIQWaWKk9ir93Q",
    authDomain: "traktator666.firebaseapp.com",
    projectId: "traktator666",
    // storageBucket: <-- НЕ НУЖЕН!
    messagingSenderId: "1030789130385",
    appId: "1:1030789130385:web:b67f742de295c8e8197730"
  };
  
  // Инициализация Firebase (только Firestore + Auth)
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Анонимный вход (обязательно!)
  auth.signInAnonymously()
    .then(() => console.log("Готово: анонимный вход"))
    .catch((err) => console.error("Ошибка входа:", err));
  
  // Отправка поста
  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value || 'Аноним';
    const message = document.getElementById('message').value;
    
    if (!message) return alert("Напишите сообщение!");
    
    // Добавляем пост в Firestore
    await db.collection('posts').add({
      name: name,
      message: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Очищаем форму
    e.target.reset();
  });
  
  // Загрузка постов в реальном времени
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .onSnapshot((snapshot) => {
      const threadsContainer = document.getElementById('threads');
      threadsContainer.innerHTML = '';
      
      snapshot.forEach((doc) => {
        const post = doc.data();
        const date = new Date(post.createdAt?.seconds * 1000).toLocaleString();
        
        threadsContainer.innerHTML += `
          <div class="thread">
            <strong>${post.name}</strong>
            <p>${post.message}</p>
            <small>${date}</small>
          </div>
        `;
      });
    });
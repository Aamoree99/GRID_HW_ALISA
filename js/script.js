document.addEventListener("DOMContentLoaded", () => {
  fetch("data/cats.json")
    .then(response => response.json())
    .then(cats => {
      const container = document.getElementById("grid-container");
      container.innerHTML = "";
      let missingImages = 0;

      console.log(`Всього записів у JSON: ${cats.length}`);

      function loadCats(filter) {
        container.innerHTML = "";

        document.querySelectorAll(".info-bar button").forEach(button => {
          button.classList.remove("active");
        });

        document.querySelector(`[data-filter="${filter}"]`).classList.add("active");

        cats.filter(cat =>
          filter === "all" ||
          (filter === "kitten" && cat.age < 2) ||
          (filter === "adult" && cat.age >= 2)
        ).forEach(cat => {
          const card = document.createElement("div");
          card.classList.add("card");

          const imageBase = `img/${cat.image.split(".")[0]}`;
          const imagePathJpg = `${imageBase}.jpg`;
          const imagePathPng = `${imageBase}.png`;

          const image = new Image();
          image.src = imagePathJpg;
          image.onload = () => setCardImage(imagePathJpg);
          image.onerror = () => {
            image.src = imagePathPng;
            image.onload = () => setCardImage(imagePathPng);
            image.onerror = () => {
              missingImages++;
              checkCompletion();
            };
          };

          function setCardImage(validPath) {
            card.innerHTML = `
                            <div class="card-inner">
                                <div class="card-front">
                                    <img src="${validPath}" alt="${cat.name}">
                                </div>
                                <div class="card-back">
                                    <h3>${cat.name}</h3>
                                    <p>Вік: ${cat.age} ${cat.age === 1 ? "рік" : "роки"}</p>
                                    <p>${cat.story}</p>
                                    <button class="adopt-btn" data-cat="${cat.name}">Забрати котика</button>
                                </div>
                            </div>
                        `;
            container.appendChild(card);
            checkCompletion();
          }
        });
      }

      function checkCompletion() {
        if (document.querySelectorAll(".card").length + missingImages === cats.length) {
          console.log(`Записів без знайдених зображень: ${missingImages}`);
        }
      }

      function loadStories() {
        fetch("data/stories.json")
          .then(response => response.json())
          .then(stories => {
            const container = document.getElementById("stories-container");
            container.innerHTML = "";

            stories.forEach(story => {
              const storyDiv = document.createElement("div");
              storyDiv.classList.add("story");
              storyDiv.innerHTML = `
                                <h3>${story.name}</h3>
                                <p>${story.text}</p>
                            `;
              container.appendChild(storyDiv);
            });
          })
          .catch(error => console.error("🚨 Помилка завантаження історій:", error));
      }

      document.querySelectorAll(".info-bar button").forEach(button => {
        button.addEventListener("click", (event) => {
          const filter = event.target.getAttribute("data-filter");
          loadCats(filter);
        });
      });

      document.addEventListener("click", (event) => {
        if (event.target.classList.contains("adopt-btn")) {
          const catName = event.target.getAttribute("data-cat");
          showNotification(`Дякуємо! ${catName} радіє, що знайшов свій дім!`);
        }
      });

      function showNotification(message) {
        let notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = "1";
        }, 10);

        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      }

      document.getElementById("help-button").addEventListener("click", () => {
        document.getElementById("modal").style.display = "block";
      });

      document.querySelector("#modal .close").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
      });

      const adoptButton = document.getElementById("adopt-button");
      const adoptModal = document.getElementById("adopt-modal");
      const closeAdoptModal = adoptModal.querySelector(".close");
      const adoptForm = document.getElementById("adopt-form");

      adoptButton.addEventListener("click", () => {
        adoptModal.style.display = "block";
      });

      closeAdoptModal.addEventListener("click", () => {
        adoptModal.style.display = "none";
      });

      window.addEventListener("click", (event) => {
        if (event.target === adoptModal) {
          adoptModal.style.display = "none";
        }
      });

      adoptForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        alert(`Дякуємо, ${name}! Ми зателефонуємо вам за номером ${phone}.`);
        adoptModal.style.display = "none";
        adoptForm.reset();
      });

      loadCats("all");
      loadStories();
    })
    .catch(error => console.error("🚨 Помилка завантаження JSON:", error));
});

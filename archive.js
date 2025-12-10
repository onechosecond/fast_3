(() => {
  const container = document.getElementById("archive-content");
  const detailContainer = document.getElementById("archive-detail");
  const labels = {
    tops: "TOPS",
    bottoms: "BOTTOMS",
    accessories: "ACCESSORIES",
  };

  function getImageFileName(category, index) {
    const prefixes = {
      tops: "top",
      bottoms: "bottom",
      accessories: "acc"
    };
    return `${prefixes[category]}_${index + 1}.png`;
  }

  function playHoverSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/select05.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playClickSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/poka03.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function showItemDetail(item, category, index) {
    const imgSrc = getImageFileName(category, index);
    const price = new Intl.NumberFormat('ko-KR').format(item.price);
    
    detailContainer.innerHTML = `
      <img class="archive-detail-image" src="${imgSrc}" alt="${item.label}" />
      <h3 class="archive-detail-name">${item.label}</h3>
      <p class="archive-detail-price">${price}원</p>
      <p class="archive-detail-description">${item.description}</p>
    `;
  }

  function renderCategory(category, items) {
    const wrapper = document.createElement("div");
    wrapper.className = "archive-category";

    const title = document.createElement("h2");
    title.textContent = labels[category];
    wrapper.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "card";

      // 랜덤한 초기 위치와 각도 설정 (겹치고 뭉쳐있는 효과)
      const randomX = (Math.random() - 0.5) * 400; // -200px ~ 200px
      const randomY = (Math.random() - 0.5) * 400; // -200px ~ 200px
      const randomRotate = (Math.random() - 0.5) * 180; // -90deg ~ 90deg
      
      // 초기 상태 설정 (랜덤 위치와 각도)
      card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
      
      // 원래 위치 저장 (제자리로 돌아갈 위치)
      card.dataset.originalX = randomX;
      card.dataset.originalY = randomY;
      card.dataset.originalRotate = randomRotate;

      // 이미지 요소 생성
      const imgContainer = document.createElement("div");
      imgContainer.style.width = "100%";
      imgContainer.style.height = "110px";
      imgContainer.style.marginBottom = "1rem";
      imgContainer.style.display = "flex";
      imgContainer.style.alignItems = "center";
      imgContainer.style.justifyContent = "center";
      imgContainer.style.overflow = "hidden";
      imgContainer.style.borderRadius = "18px";
      imgContainer.style.background = "greenyellow";

      const img = document.createElement("img");
      img.src = getImageFileName(category, index);
      img.alt = item.label;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";
      imgContainer.appendChild(img);

      const name = document.createElement("h3");
      name.textContent = item.label;

      const price = document.createElement("p");
      price.textContent = `${new Intl.NumberFormat('ko-KR').format(item.price)}원`;
      price.style.fontWeight = "500";
      price.style.color = "var(--text)";
      price.style.marginBottom = "0.5rem";

      card.appendChild(imgContainer);
      card.appendChild(name);
      card.appendChild(price);
      
      // 마우스 호버 및 클릭 사운드 추가
      card.addEventListener("mouseenter", () => {
        playHoverSound();
        // 호버 시 제자리로 이동하고 고정
        card.classList.add('returned');
      });
      
      card.addEventListener("click", () => {
        playClickSound();
        showItemDetail(item, category, index);
        
        // 모든 카드에서 blurred 클래스 제거
        document.querySelectorAll('.archive-right-panel .card').forEach(c => {
          c.classList.remove('blurred');
        });
        
        // 클릭한 카드에 blurred 클래스 추가
        card.classList.add('blurred');
        // 클릭해도 제자리에 고정
        card.classList.add('returned');
      });
      
      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  function init() {
    if (!window.DRESS_UP_ITEMS) return;
    window.DRESS_UP_ORDER.forEach((category) => {
      renderCategory(category, window.DRESS_UP_ITEMS[category]);
    });
  }

  init();
})();

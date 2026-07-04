const categories = [
  {
    name: "Poll",
    icon: "../assets/img/category-icons/poll.svg",
    color: "#5C6BC0",
    image: "../assets/img/screenshots/cat-poll.PNG",
  },
  {
    name: "Question",
    icon: "../assets/img/category-icons/question.svg",
    color: "#42A5F5",
    image: "../assets/img/screenshots/cat-quest.PNG",
  },
  {
    name: "Event",
    icon: "../assets/img/category-icons/calendar-outline.svg",
    color: "#FFA726",
    image: "../assets/img/screenshots/cat-event.PNG",
  },
  {
    name: "PSA",
    icon: "../assets/img/category-icons/megaphone-outline.svg",
    color: "#FF2C2C",
    image: "../assets/img/screenshots/cat-announce.PNG",
  },
  {
    name: "Confession",
    icon: "../assets/img/category-icons/chatbubble-ellipses-outline.svg",
    color: "#AB47BC",
    image: "../assets/img/screenshots/cat-conf.PNG",
  },
  {
    name: "Advice",
    icon: "../assets/img/category-icons/bulb-outline.svg",
    color: "#2bae00ff",
    image: "../assets/img/screenshots/cat-advice.PNG",
  },
  {
    name: "Crush",
    icon: "../assets/img/category-icons/heart-outline.svg",
    color: "#ff6497ff",
    image: "../assets/img/screenshots/cat-crush.PNG",
  },
  {
    name: "Meme",
    icon: "../assets/img/category-icons/happy-outline.svg",
    color: "#e2c800ff",
    image: "../assets/img/screenshots/cat-crush.PNG",
  },
  {
    name: "Lifehack",
    icon: "../assets/img/category-icons/leaf-outline.svg",
    color: "#9CCC65",
    image: "../assets/img/screenshots/cat-life.PNG",
  },
  {
    name: "Debate",
    icon: "../assets/img/category-icons/chatbubbles-outline.svg",
    color: "#000",
    image: "../assets/img/screenshots/cat-deb.PNG",
  },
];

const categoriesGrid = document.getElementById("categories-grid");

if (categoriesGrid) {
  const isSemicircle = () => window.matchMedia('(min-width: 1024px)').matches;

  const angleForIndex = (index, total) => {
    if (isSemicircle()) return 180 + (index / (total - 1)) * 180;
    return (index / total) * 360 - 90;
  };

  // --- Update orbit radius dynamically ---
  const updateCategoriesOrbit = () => {
    const sampleItem = categoriesGrid.querySelector(".category-item");
    if (!sampleItem) return;

    const gridRect = categoriesGrid.getBoundingClientRect();
    const itemRect = sampleItem.getBoundingClientRect();
    const ringPadding = Math.max(8, Math.min(16, gridRect.width * 0.02));
    // Semicircle: use width only so orbit fills the full horizontal span
    const diameter = isSemicircle()
      ? gridRect.width
      : Math.min(gridRect.width, gridRect.height);
    const radius = Math.max(110, diameter / 2 - itemRect.width / 2 - ringPadding);
    categoriesGrid.style.setProperty("--orbit-radius", `${radius}px`);
  };

  // --- Build the ring ---
  const buildRing = () => {
    const total = categories.length;
    categoriesGrid.classList.toggle('semicircle', isSemicircle());
    const existing = categoriesGrid.querySelectorAll('.category-item');
    if (existing.length === total) {
      existing.forEach((item, i) =>
        item.style.setProperty('--angle', `${angleForIndex(i, total)}deg`)
      );
      return;
    }
    categoriesGrid.innerHTML = `
      <div class="categories-center">
        <strong id="category-title">Categories</strong>
        <span id="category-subtitle">Browse by topic</span>
      </div>
      ${categories.map((category, index) => `
        <div
          class="category-item"
          style="
            --angle: ${angleForIndex(index, total)}deg;
            --icon-color: ${category.color};
            --icon-mask: url('${category.icon}');
          "
          data-name="${category.name}"
          data-color="${category.color}"
          data-index="${index}"
          data-image="${category.image || ''}"
        >
          <div class="icon"></div>
        </div>
      `).join("")}
    `;
  };

  buildRing();

  // --- Update orbit on resize, rebuild angles when breakpoint crosses ---
  let _wasSemicircle = isSemicircle();
  window.addEventListener("resize", () => {
    const semi = isSemicircle();
    if (semi !== _wasSemicircle) {
      _wasSemicircle = semi;
      buildRing();
      attachListeners();
    }
    updateCategoriesOrbit();
  });

  if ("ResizeObserver" in window) {
    const categoriesResizeObserver = new ResizeObserver(updateCategoriesOrbit);
    categoriesResizeObserver.observe(categoriesGrid);
  }

  // --- Hover/Touch Interaction ---
  const center = document.querySelector(".categories-center");
  const title = document.getElementById("category-title");
  const subtitle = document.getElementById("category-subtitle");

  let activeItem = null;

  const activateItem = (item) => {
    if (activeItem) activeItem.classList.remove("touch-active");

    activeItem = item;

    if (item) {
      item.classList.add("touch-active");
      center.style.background = item.dataset.color;
      center.classList.add("active");
      title.textContent = item.dataset.name;
      subtitle.textContent = "Category";
      title.style.color = "#fff";
      subtitle.style.color = "rgba(255,255,255,.85)";

      if (window.setPhoneImageOverride) {
        window.setPhoneImageOverride(item.dataset.image || null);
      }
    }
  };

  const cleanupAllItems = () => {
    document.querySelectorAll(".category-item").forEach((item) => {
      item.classList.remove("touch-active");
      item.blur();
      // Remove any inline styles that might have been applied
      item.style.removeProperty("background");
      item.style.removeProperty("z-index");
      // Force a reflow to clear any cached styles
      void item.offsetHeight;
    });
  };

  // --- Then update deactivateItem to use it ---

  const deactivateItem = () => {
    if (activeItem) {
      activeItem.classList.remove("touch-active");
      activeItem.blur();
      activeItem.style.removeProperty("background");
      activeItem.style.removeProperty("z-index");
      void activeItem.offsetHeight;
      activeItem = null;
    }
    center.classList.remove("active");
    center.style.background = "";
    title.textContent = "Categories";
    subtitle.textContent = "Browse by topic";
    title.style.color = "";
    subtitle.style.color = "";

    if (window.setPhoneImageOverride) window.setPhoneImageOverride(null);
  };

  document.querySelectorAll(".category-item").forEach((item) => {
    // --- Desktop hover ---
    item.addEventListener("mouseenter", () => {
      activateItem(item);
    });

    item.addEventListener("mouseleave", () => {
      deactivateItem();
    });

    // --- Touch support ---
    item.addEventListener("touchstart", (e) => {
      // Prevent default to avoid double-tap zoom interference
      e.preventDefault();

      // If this item is already active, deactivate it
      if (activeItem === item) {
        deactivateItem();
        // ADD THIS - Force remove focus state
        item.blur();
        // ADD THIS - Force remove any lingering styles
        item.style.removeProperty("background");
      } else {
        // If there's an active item, deactivate it first
        if (activeItem) {
          activeItem.classList.remove("touch-active");
          activeItem.blur();
          activeItem.style.removeProperty("background");
        }
        activateItem(item);
      }
    });

    item.addEventListener("click", (e) => {
      // Only handle on touch devices where click might fire after touch
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        // If we already handled this via touchstart, ignore
        if (e.target.closest(".category-item") && !activeItem) {
          // If no active item, activate this one
          activateItem(item);
        }
      }
    });

    // --- Keyboard accessibility ---
    item.addEventListener("focus", () => {
      activateItem(item);
    });

    item.addEventListener("blur", () => {
      deactivateItem();
    });
  });

  // --- Click outside to deactivate (for touch devices) ---
  document.addEventListener("click", (e) => {
    if (
      activeItem &&
      !activeItem.contains(e.target) &&
      !center.contains(e.target)
    ) {
      deactivateItem();
    }
  });
}

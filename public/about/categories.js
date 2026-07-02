const categories = [
  {
    name: "Poll",
    icon: "../assets/img/category-icons/poll.svg",
    color: "#5C6BC0",
  },
  {
    name: "Question",
    icon: "../assets/img/category-icons/question.svg",
    color: "#42A5F5",
  },
  {
    name: "Event",
    icon: "../assets/img/category-icons/calendar-outline.svg",
    color: "#FFA726",
  },
  {
    name: "PSA",
    icon: "../assets/img/category-icons/megaphone-outline.svg",
    color: "#FF2C2C",
  },
  {
    name: "Confession",
    icon: "../assets/img/category-icons/chatbubble-ellipses-outline.svg",
    color: "#AB47BC",
  },
  {
    name: "Advice",
    icon: "../assets/img/category-icons/bulb-outline.svg",
    color: "#2bae00ff",
  },
  {
    name: "Crush",
    icon: "../assets/img/category-icons/heart-outline.svg",
    color: "#ff6497ff",
  },
  {
    name: "Meme",
    icon: "../assets/img/category-icons/happy-outline.svg",
    color: "#e2c800ff",
  },
  {
    name: "Lifehack",
    icon: "../assets/img/category-icons/leaf-outline.svg",
    color: "#9CCC65",
  },
  {
    name: "Debate",
    icon: "../assets/img/category-icons/chatbubbles-outline.svg",
    color: "#000",
  },
];

const categoriesGrid = document.getElementById("categories-grid");

if (categoriesGrid) {
  const angleStep = 360 / categories.length;

  // --- Update orbit radius dynamically ---
  const updateCategoriesOrbit = () => {
    const sampleItem = categoriesGrid.querySelector(".category-item");
    if (!sampleItem) return;

    const gridRect = categoriesGrid.getBoundingClientRect();
    const itemRect = sampleItem.getBoundingClientRect();
    const ringPadding = Math.max(8, Math.min(16, gridRect.width * 0.02));
    const radius = Math.max(
      110,
      Math.min(gridRect.width, gridRect.height) / 2 -
        itemRect.width / 2 -
        ringPadding,
    );
    categoriesGrid.style.setProperty("--orbit-radius", `${radius}px`);
  };

  // --- Build the ring ---
  categoriesGrid.innerHTML = `
    <div class="categories-center">
      <strong id="category-title">Categories</strong>
      <span id="category-subtitle">Browse by topic</span>
    </div>
    ${categories
      .map(
        (category, index) => `
          <div
            class="category-item"
            style="
              --angle: ${index * angleStep - 90}deg;
              --icon-color: ${category.color};
              --icon-mask: url('${category.icon}');
            "
            data-name="${category.name}"
            data-color="${category.color}"
          >
            <div class="icon"></div>
          </div>
        `,
      )
      .join("")}
  `;

  // --- Update orbit on resize ---
  updateCategoriesOrbit();
  window.addEventListener("resize", updateCategoriesOrbit);

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
    // Remove active state from previous item
    if (activeItem) {
      activeItem.classList.remove("touch-active");
    }

    // Set new active item
    activeItem = item;

    if (item) {
      item.classList.add("touch-active");
      center.style.background = item.dataset.color;
      center.classList.add("active");
      title.textContent = item.dataset.name;
      subtitle.textContent = "Category";
      title.style.color = "#fff";
      subtitle.style.color = "rgba(255,255,255,.85)";
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
      // Force reflow
      void activeItem.offsetHeight;
      activeItem = null;
    }
    center.classList.remove("active");
    center.style.background = "";
    title.textContent = "Categories";
    subtitle.textContent = "Browse by topic";
    title.style.color = "";
    subtitle.style.color = "";
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

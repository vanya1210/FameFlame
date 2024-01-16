// Create an empty array to store YouTube players
let players = [];

// Function to create YouTube players
window.onYouTubeIframeAPIReady = function () {
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe, index) => {
    players[index] = new YT.Player(iframe);
    console.log(players);
  });
};

document.addEventListener("DOMContentLoaded", (event) => {
  const leftArrow = document.querySelector(".ArowLeft");
  const rightArrow = document.querySelector(".ArowRight");
  const burgerMenu = document.querySelector(".burgerMenu");
  const closeCross = document.querySelector(".closeCross");
  const carouselItems = Array.from(
    document.querySelectorAll(".carouseleItem")
  );
  const indexElements = Array.from(
    document.querySelectorAll(".imgWrapCarousele")
  );

  function pauseAndSeekVideos() {
    players.forEach((player) => {
      if (
        player &&
        player.getPlayerState &&
        player.getPlayerState() === 1
      ) {
        player.pauseVideo();
        player.seekTo(0);
      }
    });
  }
  function updateActiveIndex() {
    let activeIndex = carouselItems.findIndex((item) =>
      item.className.includes("test3")
    );
    indexElements.forEach((indexElement, index) => {
      if (index === activeIndex) {
        indexElement.querySelector("img").src = "https://storage.googleapis.com/fameflame/activeTest.svg";
      } else {
        indexElement.querySelector("img").src =
          "https://storage.googleapis.com/fameflame/inactiveTest.svg";
      }
    });
  }

  function handleRightArrowClick() {
    console.log("Right arrow clicked");
    carouselItems.forEach((item, index) => {
      let currentClass = item.className.match(/test(\d)/);
      if (currentClass) {
        let newClass = `test${
          currentClass[1] === "1" ? 5 : currentClass[1] - 1
        }`;
        item.classList.remove(`test${currentClass[1]}`);
        item.classList.add(newClass);
      }
    });
    pauseAndSeekVideos();
    updateActiveIndex();
  }

  function handleLeftArrowClick() {
    console.log("Left arrow clicked");
    carouselItems.forEach((item, index) => {
      let currentClass = item.className.match(/test(\d)/);
      if (currentClass) {
        let newClass = `test${
          currentClass[1] === "5" ? 1 : Number(currentClass[1]) + 1
        }`;
        item.classList.remove(`test${currentClass[1]}`);
        item.classList.add(newClass);
      }
    });
    pauseAndSeekVideos();
    updateActiveIndex();
  }

  rightArrow.addEventListener("click", handleRightArrowClick);
  leftArrow.addEventListener("click", handleLeftArrowClick);

  function openMobileMenu() {
    const mobileMenu = document.querySelector(".mobileMenu");
    mobileMenu.style.display = "flex";
    setTimeout(() => {
      mobileMenu.style.left = "0";
      document.body.style.overflowY = "hidden";
      document.documentElement.style.overflow = "hidden";
    }, 500);
  }
  function closeMobileMenu() {
    const mobileMenu = document.querySelector(".mobileMenu");

    mobileMenu.style.left = "100vw";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.overflowX = "hidden";
    setTimeout(() => {
      mobileMenu.style.display = "none";
    }, 500);
  }

  burgerMenu.addEventListener("click", openMobileMenu);
  closeCross.addEventListener("click", closeMobileMenu);

  // Get all the anchor elements inside the mobile menu
  const menuLinks = document.querySelectorAll(".mobileMenu a");

  // Add a click event listener to each link
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      // Prevent the default action (navigation) from happening immediately
      event.preventDefault();

      // Close the mobile menu
      closeMobileMenu();

      // After the menu has closed, navigate to the link's href
      setTimeout(() => {
        window.location.href = this.href;
      }, 1000); // The delay should match the one in closeMobileMenu
    });
  });

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      const radioButton = item.querySelector(".faq-question");
      if (radioButton.checked && event.target.tagName !== "INPUT") {
        event.preventDefault(); // Prevent the default action (which is to check the radio button)
        radioButton.checked = false; // Uncheck the radio button
      } else if (
        !radioButton.checked &&
        event.target.tagName !== "INPUT"
      ) {
        radioButton.checked = true; // Check the radio button
      }
    });
  });
});
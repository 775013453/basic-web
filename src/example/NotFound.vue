<template>
  <article class="main">
    <section>
      <img
        src="@/assets/img/wrong/no-data.png"
        alt="加载失败"
      />
      <h1>404，访问页面离家出走了!</h1>
    </section>
  </article>
</template>

<style lang="scss" scoped>
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.15);
    section {
      text-align: center;
      img {
        width: 240px;
      }
      h1 {
        width: 100%;
        text-align: center;
        font-size: 1.5em;
      }
    }
  }
</style>

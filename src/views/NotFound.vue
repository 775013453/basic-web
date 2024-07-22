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
    section {
      text-align: center;
      img {
        width: 180px;
      }
      h1 {
        width: 100%;
        text-align: center;
      }
    }
  }
</style>

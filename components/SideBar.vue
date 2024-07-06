<template>
  <div class="layout has-sidebar" v-bind:class="{ rtl }">
    <aside class="sidebar break-point-md" v-bind:class="{ collapsed, toggled }">
      Sidebar
    </aside>
    <div class="overlay" v-on:click="setToggled()"></div>
    <div class="layout">
      <header class="header">Header</header>
      <main class="content">
        <div>
          <a href="#" class="btn" v-on:click="setCollapsed()">Collapse</a>
        </div>
        <div class="sidebar-toggler break-point-md">
          <a href="#" class="btn" v-on:click="setToggled()">Toggle</a>
        </div>
        <div>
          <a href="#" class="btn" v-on:click="setRTL()">RTL</a>
        </div>
      </main>
      <footer class="footer">Footer</footer>
    </div>
  </div>
</template>
<script>
export default {
  name: "App",
  data: () => ({
    collapsed: false,
    toggled: false,
    rtl: false,
  }),
  methods: {
    setCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setToggled() {
      this.toggled = !this.toggled;
    },
    setRTL() {
      this.rtl = !this.rtl;
    },
  },
};
</script>
<style scoped>
.layout .header {
  background-color: #fff;
  box-shadow: 1px 1px 4px #9aa0b9;
  display: flex;
  align-items: center;
  padding: 20px;
}

.layout .content {
  background-color: #bec4de;
  padding: 20px;
}

.layout .footer {
  text-align: center;
  background-color: #a7aed0;
  padding: 20px;
}

.layout .sidebar {
  background-color: #292e3e;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  font-family: "Karla", sans-serif;
}

a.btn {
  display: inline-block;
  margin: 10px 0;
  padding: 8px 20px;
  background-color: #fff;
  text-decoration: none;
  color: #000;
  box-shadow: 1px 1px 4px #8990ad;
  width: 100px;
  text-align: center;
  border-radius: 4px;
  font-size: 0.9rem;
}

a.btn:hover {
  background-color: #f1f1f1;
}
</style>
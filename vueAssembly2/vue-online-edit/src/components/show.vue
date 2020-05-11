<template>
  <div class="show">
    <h1>代码运行结果</h1>

    <div class="show-box" ref="show">这里显示最终的结果</div>
  </div>
</template>

<script>
export default {
  props: {
    code: {
      //会将这个属性放到当前的实例上
      type: String, //默认code就是一个字符串类型
      default: ""
    }
  },
  methods: {
    getSource(type) {
      const reg = new RegExp(`<${type}[^>]*>`); //开始标签
      let code = this.code;
      let matches = code.match(reg);
      if (matches) {
        let tag = matches[0];
        return code.slice(
          code.indexOf(tag) + tag.length,
          code.lastIndexOf(`</${type}>`)
        );
      }
      return "";
    },
    run() {
      //    1.获取模板中的内容 js  css
      const template = this.getSource("template");
      const script = this.getSource("script").replace(
        /export default/,
        "return"
      );
      const style = this.getSource("style");

      //   动态的加载一个组件， 组件就是一个对象，对象包含 数据，render函数，生命周期,方法
      let component = {};
      if (script) {
          component = new Function(script)();
      }
      if (template) {
        component.template = template;

        // $mount可以实现手动挂载组件
        // 先获取组件的实例  
        let instance = new (this.$options._base.extend(component))
        this.$refs.show.appendChild(instance.$mount().$el);//在内存中进行挂载，挂载的结果放在$el上
        
      }

      if (style) {
        let element = document.createElement("style");
        element.type = "text/css";
        element.innerText = style;
        document.body.appendChild(element);
      }
    }
  }
};
</script>

<style>
</style>
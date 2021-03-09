<template>
  <div>
    <button class="add-row" @click="addRow">+</button><br>
    <div v-if="rows && rows.length > 0" class="list-wrapper">
        <div v-for="(row,i) in rows" :key="i"   >
            <input class="row-input" v-model="row.value" ref="myInputs" />
            <button class="row-up" @click="up(row,i)"> &uarr;</button>
            <button class="row-down" @click="down(row,i)">&#8595;</button>
            <button class="row-delete" @click="remove(i)">x</button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: []
    }
  },
  methods: {
    addRow() {
      this.rows.push({
        value: ''
      })
      this.$nextTick(() => {
          const lastIdx = this.rows.length - 1;
          if(this.$refs.myInputs.length > 0) {
            this.$refs.myInputs[lastIdx].focus();
          }
      });
    },
   remove(index) {
    this.rows.splice(index,1)
   },
    down(row,index) {
      const newInps = [...this.rows]
      if (index === this.rows.length - 1) {
       this.$nextTick(() => {
            this.$refs.myInputs[index].focus();
        });
        return;
      }
      [newInps[index], newInps[index+1]] = [newInps[index+1], newInps[index]];
      this.rows = newInps
      this.$nextTick(() => {
          this.$refs.myInputs[index+1].focus();
      });
   },
   up(row,index) {
      const newInps = [...this.rows]
       if (index === 0) {
         this.$nextTick(() => {
            this.$refs.myInputs[index].focus();
        });
         return;
        }
       [newInps[index], newInps[index-1]] = [newInps[index-1], newInps[index]];
       this.rows = newInps
       this.$nextTick(() => {
          if(this.$refs.myInputs.length > 0) {
            this.$refs.myInputs[index-1].focus();
          }
       });
    },
  }
}
</script>
<style scoped>
  .list-wrapper {
    margin-top: 8px;
  }
  .row-up, .row-down, .row-delete {
    margin: 3px;
  }
</style>

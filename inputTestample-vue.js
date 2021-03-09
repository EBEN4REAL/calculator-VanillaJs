import '../../src/setup'
import Vue from "vue";
import { mount } from "@vue/test-utils";
import DynamicInput from "@/components/DynamicInput.vue";

let di;
let addRowBtn;

const makeTestTable = items => {
  items.forEach(_ => addRowBtn.trigger("click"));
  items.forEach((e, i) => 
    di.findAll(".row-input").at(i).setValue(e)
  );
};

describe("DynamicInput", () => {
  beforeEach(() => {
    di = mount(DynamicInput,
      {attachToDocument: true}
    );
    addRowBtn = di.find(".add-row");
  });
  afterEach(() => {
    di.destroy();
    addRowBtn = null;
  });
  
  test('should have an "add-row" button', () => {
    expect(addRowBtn.exists()).toBe(true);
    expect(di.findAll(".add-row")).toHaveLength(1);
  });
  
  test('should have no rows before "add-row" is clicked', () => {
    [
      ".row-input", 
      ".row-delete", 
      ".row-up", 
      ".row-down"
    ].forEach(e => expect(di.find(e).exists()).toBe(false));
  });
  
  test('should add a row on pushing the "add-row" button', () => {
    addRowBtn.trigger("click");
    [
      ".row-input", 
      ".row-delete", 
      ".row-up", 
      ".row-down"
    ].forEach(e => expect(di.findAll(e)).toHaveLength(1));
  });
  
  test('should change focus to the new row on clicking the "add-row" button', () => {
    addRowBtn.trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual(""); 
    });
  });
  
  test('should be able to add multiple rows', () => {
    for (let i = 1; i < 5; i++) {
      addRowBtn.trigger("click");
      [
        ".row-input", 
        ".row-delete", 
        ".row-up", 
        ".row-down"
      ].forEach(e => expect(di.findAll(e)).toHaveLength(i));
    }
  });

  test('should be able to add text to the input fields', () => {
    const items = [
      "apples",
      "pears",
      "watermelon",
      "cantaloupe"
    ];
    makeTestTable(items);
    
    items.forEach((e, i) => {
      const input = di.findAll(".row-input").at(i);
      expect(input.element.value).toEqual(e);
    });
  });

  test('should be able to change the text of an input field', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    const input = di.findAll(".row-input").at(3);
    input.setValue("bananas");
    expect(input.element.value).toEqual("bananas");
  });
 
  test('should be able to move a row up', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.findAll(".row-up").at(3).trigger("click");
    [
      "apples",
      "pears",
      "cantaloupe",
      "watermelon",
    ].forEach((e, i) => {
      expect(di.findAll(".row-input").at(i).element.value).toEqual(e);
    });
  });

  test('should focus the correct input element after moving a row up', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.findAll(".row-up").at(3).trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("cantaloupe"); 
    });
  });

  test('should be able to move a row down', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.findAll(".row-down").at(0).trigger("click");
    [
      "pears",
      "apples",
      "watermelon",
      "cantaloupe",
    ].forEach((e, i) => {
      expect(di.findAll(".row-input").at(i).element.value).toEqual(e);
    });
  });

  test('should focus the correct input element after moving a row down', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.findAll(".row-down").at(0).trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("apples"); 
    });
  });

  test('should work when an input field is moved down but is already at the bottom', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.findAll(".row-down").at(3).trigger("click");
    [
      "apples",
      "pears",
      "watermelon",
      "cantaloupe",
    ].forEach((e, i) => {
      expect(di.findAll(".row-input").at(i).element.value).toEqual(e);
    });
  });

  test('should focus the last input element after moving a row down that is already at the bottom', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.findAll(".row-down").at(3).trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("cantaloupe"); 
    });
  });

  test('should work when an input field is moved up but is already at the top', () => {
    makeTestTable(["apples", "pears"]);
    di.findAll(".row-up").at(0).trigger("click");
    [
      "apples",
      "pears",
    ].forEach((e, i) => {
      expect(di.findAll(".row-input").at(i).element.value).toEqual(e);
    });
  });
  
  test('should focus the 0-th input element after moving a row up which is already at the top', () => {
    makeTestTable(["apples", "pears"]);
    di.findAll(".row-up").at(0).trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("apples"); 
    });
  });

  test('should work when the bottom row is deleted', () => {
    makeTestTable(["oranges", "strawberries"]);
    di.findAll(".row-delete").at(1).trigger("click");
    expect(di.findAll(".row-input")).toHaveLength(1);
    expect(di.findAll(".row-input").at(0).element.value).toEqual("oranges");
  });

  test('should focus the last input element after deleting the bottom row', () => {
    makeTestTable(["stawberries", "pears", "bananas", "grapefruit"]);
    di.findAll(".row-delete").at(3).trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("bananas"); 
    });
  });

  test('should work when a middle row is deleted', () => {
    makeTestTable(["pears", "apples", "bananas"]);
    di.findAll(".row-delete").at(1).trigger("click");
    expect(di.findAll(".row-input").at(0).element.value).toEqual("pears");
    expect(di.findAll(".row-input").at(1).element.value).toEqual("bananas");
  });

  test('should focus the correct input element after deleting a middle row', () => {
    makeTestTable(["pears", "apples", "bananas"]);
    di.findAll(".row-delete").at(1).trigger("click");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("bananas"); 
    });
  });

  test('should work when the remaining rows are deleted', () => {
    makeTestTable(["pears", "apples"]);
    di.findAll(".row-delete").at(0).trigger("click");
    expect(di.findAll(".row-input").at(0).element.value).toEqual("apples");
    expect(di.findAll(".row-input")).toHaveLength(1);
    expect(di.findAll(".row-delete")).toHaveLength(1);
    expect(di.findAll(".row-up")).toHaveLength(1);
    expect(di.findAll(".row-down")).toHaveLength(1);
    di.findAll(".row-delete").at(0).trigger("click");
    expect(di.findAll(".row-input").exists()).toBe(false);
    expect(di.findAll(".row-delete").exists()).toBe(false);
    expect(di.findAll(".row-up").exists()).toBe(false);
    expect(di.findAll(".row-down").exists()).toBe(false);
  });
  
  test('should work when a row is re-added and modified after clearing the list', () => {
    expect(di.findAll(".row-input")).toHaveLength(0);
    addRowBtn.trigger("click");
    expect(di.findAll(".row-input")).toHaveLength(1);
    expect(di.findAll(".row-delete")).toHaveLength(1);
    expect(di.findAll(".row-up")).toHaveLength(1);
    expect(di.findAll(".row-down")).toHaveLength(1);
    const input = di.findAll(".row-input").at(0);
    input.setValue("cucumber");
    expect(input.element.value).toEqual("cucumber");
    di.findAll(".row-up").at(0).trigger("click");
    di.findAll(".row-down").at(0).trigger("click");
    expect(input.element.value).toEqual("cucumber");
    return Vue.nextTick().then(() => {
      expect(document.activeElement).not.toEqual(undefined); 
      expect(document.activeElement.value).toEqual("cucumber"); 
    });
  });
});

import { Mongo } from 'meteor/mongo';

//bao gồm quảng cáo và quản lý hình ảnh
Notifications = new Mongo.Collection('notifications');
Notifications.allow({
  insert: function () {
      return true;
  },
  update: function () {
      return true;
  },
  remove: function () {
      return true;
  }
});

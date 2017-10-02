import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

export function Print (data) {
  var popupWin = window.open('', '_blank');
  let head = '';
  let rows = '';
  let totalAmount = 0, totalStt = 1, openingStockCount = 0, usingMiddleStockCount = 0, removeCount = 0, lostCount = 0, cancelCount = 0, lastStockCount = 0;
  head +=
  '<tr>' +
  	'<th>STT</th>' +
    '<th style="max-width: 75px; white-space: pre-line;">Tên khách hàng</th>' +
    '<th style="max-width: 100px; white-space: pre-line; min-width: 100px;">Ngày tạo</th>' +
    '<th style="max-width: 75px; white-space: pre-line;">Số  điện thoại</th>' +
    '<th style="max-width: 300px; white-space: pre-line; min-width: 300px;">Địa chỉ email</th>' +
  '</tr>';
  __.forEach(data, stock => {
    totalStt++;
    rows += '<tr>' +
                '<td style="border: 1px solid; text-align: left; padding-left: 5px;">' + totalStt + '</td>' +
                '<td style="border: 1px solid; text-align: left; padding-left: 5px;">' + stock.name + '</td>' +
                '<td style="border: 1px solid; text-align: right; padding-right: 5px;">' + moment(stock.createdAt).format('DD/MM/YYYY') + '</td>' +
                '<td style="border: 1px solid; text-align: right; padding-right: 5px;">' + stock.mobile + '</td>' +
                '<td style="border: 1px solid; text-align: right; padding-right: 5px; max-width: 60px; white-space: pre-line; min-width: 60px;">' + stock.email + '</td>' +
            '</tr>';
  });
  popupWin.document.open();
  popupWin.document.write('<html>' +
  '<head>' +
  '<style>' +
  '<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
  '@page {margin-left: 0.1cm; margin-right: 0.1cm;}' +
  'th, td {border: 1px solid;}' +
  'html {font-family: sans-serif;}' +
  '</style>' +
  '</head>' +
  '<body style="font-family: \'sans-serif\'" onload="setTimeout(function(){window.print();},500)">' +
  '<div>' +
  '<h3 style="margin:0; text-align: center">DANH SÁCH KHÁCH HÀNG</h3>'+
  '<h3 style="margin:0; text-align: center">TRẢI NGHIỆM VIỆT</h3>'+
  '<p style="text-align: center; margin: 0">' + moment().format('DD/MM/YYYY') + '</p>'+
  '</div>' +
  '<table style="width: 100%; white-space: nowrap; border: 1px solid; border-collapse: collapse; margin-top: 15px;">' +
  '<thead>' + head + '</thead>'+
  '<tbody>' + rows + '</tbody>' +
  '</table>' +
  '</html>');
  popupWin.document.close();
}

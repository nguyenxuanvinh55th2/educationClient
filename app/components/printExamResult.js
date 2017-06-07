import accounting from 'accounting';
import moment from 'moment';
import __ from 'lodash';

export default function printExamResult(examination, player, results, totalScore) {
    let content = '<div style="padding: 0px 10%;">';
    __.forEach(results, (item, idx) => {
      content +=
      '<div>' +
        '<h3>'+ 'Câu ' + (idx + 1).toString() + ': ' + item.question.question + '</h3>' +
      '</div>' +
      '<div style="display: -webkit-flex; Webkit-flex-wrap: wrap; display: flex; flex-wrap: wrap">';
      __.forEach(item.question.answerSet, sub => {
        content +=
        '<label style="display: flex; flex-direction: row; justify-content: flex-start;">' +
          '<input ' + (item.answer.indexOf(sub) > -1 ? 'checked ' : ' ') + 'type="checkbox" style="margin-top: 15px;" disabled/>' +
          '<div style="width: 300; margin-right: 50; margin-bottom: 10; margin-left: 10; height: 50; background-color: white; padding: 0px 15px 15px 0px; font-weight: lighter; border-radius: 10; display: flex; flex-direction: column; justify-content: center;">' +
            sub +
          '</div>' +
        '</label>';
      })
      content += '</div>';
      content +=
      '<div>' +
        '<p>Đáp án: ' + item.question.correctAnswer.toString() + '</p>' +
      '</div>' +
      '<div>' +
        '<p>Điểm số: ' + item.score + '</p>' +
      '</div>';
    })
    content += '</div>'

    var popupWin = window.open('', '_blank');
    var body = '<html>' +
        '<head>' +
        '<style>' +
        '@page {margin-left: 0.1cm; margin-right: 0.1cm;}' +
        'table, th, td {border: 1px solid;}' +
        '</style>' +
        '</head>' +
        '<body onload="setTimeout(function(){window.print();},500)">' +
          '<div style="display: flex; flex-direction: row; justify-content: space-between;">' +
            '<div>' +
              '<h3 style="margin: 0px;">Kỳ thi: '+examination.name+'</h3>' +
              '<h3 style="margin: 0px;">Tên thí sinh: '+player.user.name+'</h3>' +
              '<h3 style="margin: 0px;">Tổng điểm: '+totalScore.toString()+'</h3>' +
            '</div>' +
            '<img style="border-radius: 100%; width: 68px; height: 70px; margin-top: -7px;" src=' + '"' + player.user.checkOutImage[0].link + '"' + '/>' +
          '</div>' +
          '<hr style="margin-top: 5px;">' +
          '<div style="text-align: center">' +
            '<h3 style="margin: 0px;"> KẾT QUẢ </h3>'+
            '<h6 style="margin: 0px;"> Ngày In ' + moment().format('DD.MM.YYYY') + '</h6>'+
          '</div>';
        body += content;
        body += '</body>' +
        '</html>';
    popupWin.document.open();
    popupWin.document.write(body);
    popupWin.document.close();
}

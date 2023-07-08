class Customer {
	constructor(id, fullName, email, phone, address, balance, deleted) {
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.balance = balance;
        this.delete = deleted;
	}

}
class Deposit {
    constructor(id, customerId, transactionAmount) {
      this.id = id;
      this.customerId = customerId;
      this.transactionAmount = transactionAmount;
    }
}
class Withdraw {
    constructor(id, customerId, transactionAmount) {
      this.id = id;
      this.customerId = customerId;
      this.transactionAmount = transactionAmount;
    }
}
class Transfer {
    constructor(id, senderId, recipientId, fees, transferAmount, feesAmount, transactionAmount) {
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.fees = fees;
        this.transferAmount = transferAmount;
        this.feesAmount = feesAmount;
        this.transactionAmount = transactionAmount;
    }
}

let id = 1;
let customerId = 0;

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

let  customer = {};

function renderCustomer(obj) { 
    return  `
            <tr id="tr_${obj.id}">
                <td>${obj.id} </td>
                <td>${obj.fullName} </td>
                <td>${obj.email} </td>
                <td>${obj.phone} </td>
                <td>${obj.address} </td>
                <td class="text-end num-space">${obj.balance}</td>
                <td>
                    <button  class="btn btn-outline-secondary edit" data-id="${obj.id}" >
                            <i class="far fa-edit"></i>
                    </button>
                    <button  class="btn btn-outline-success deposit" data-id="${obj.id}">
                                <i class="fas fa-plus"></i>
                    </button>
                    <button  class="btn btn-outline-warning withdraw" data-id="${obj.id}">
                            <i class="fa fa-minus"></i>
                    </button>
                    <button  class="btn btn-outline-primary transfer" data-id="${obj.id}">
                            <i class="fas fa-exchange-alt" ></i>
                    </button>
                    <button  class="btn btn-outline-danger delete" data-id="${obj.id}">
                            <i class="fas fa-ban" ></i>
                    </button>
                </td>
            </tr>`;
        
}

function getAllCustomers() {
    const tbCustomerBody = $("#tbCustomer tbody");

    tbCustomerBody.empty();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/customers?deleted=0'
    })
        .done((data) => {
            data.forEach(item => {
                const str = renderCustomer(item);
                tbCustomerBody.prepend(str);                
            });

            addEventShowModalUpdate();
            addEventShowModalDeposit();
            addEventShowModalWithdraw();
            addEventDeleteCustomer();
            addEventShowModalTransfer();
        })
        .fail((error) => {
            console.log(error);
        })
}

getAllCustomers();


/******************** Create *************************/

function handleCreate () {
    const btnCreate = $("#btnCreate");
    btnCreate.on("click", function () {

        const fullName = $("#fullNameCreate").val();
        const email = $("#emailCreate").val();
        const phone = $("#phoneCreate").val();
        const address = $("#addressCreate").val();
        const balance = 0;
        const deleted = 0;

        const obj = {
            fullName, 
            email, 
            phone, 
            address, 
            balance, 
            deleted
        };

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type':  'application/json'
            },
            type: "POST",
            url: "http://localhost:3000/customers",
            data: JSON.stringify(obj)
        })
            .done((data) => {
                const str = renderCustomer(data);
                const tbCustomerBody = $('#tbCustomer tbody');
                tbCustomerBody.prepend(str);

                $('#createModal').modal('hide');


                addEventShowModalUpdate();
                addEventShowModalDeposit();
                addEventShowModalWithdraw();
                addEventDeleteCustomer();
                addEventShowModalTransfer();

                
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Thêm khách hàng thành công',
                    showConfirmButton: false,
                    timer: 1500
                })

                let formValue = $(".form-control");
                for (var i = 0; i < formValue.length; i++) {
                    formValue[i].val("");
                }
                
            })
            .fail((error) => {
                console.log(error);
            });

    });
}
handleCreate()

/******************** Find *************************/

function getCustomerById(id) {
	return $.ajax ({
        type: 'GET',
        url: 'http://localhost:3000/customers/' + id,
    });
}

// function findCustomerIndexById(id) {
//     let index = -1;

//     for (let i = 0; i < customers.length; i++) {
//         if (customers[i].id === id) {
//             index = i;
//         }
//     }

//     return index;
// }
/******************** Show Modal *************************/

function addEventShowModalUpdate(){
    let btnEdit = $(".edit");
    btnEdit.off('click');
    btnEdit.on('click', function () {
        customerId = $(this).data('id');

        const modalUpdate = $('#modalUpdate');

        getCustomerById(customerId).then((data) =>{
            $("#fullNameUpdate").val(data.fullName);
            $("#emailUpdate").val(data.email);
            $("#phoneUpdate").val(data.phone);
            $("#addressUpdate").val(data.address);

            modalUpdate.modal('show');
        })
            .catch((error) => {
                console.log(error);
            }); 
    });

}

function addEventShowModalDeposit () {
    let btnDeposit = $(".deposit");
    btnDeposit.on("click", function () {
        customerId = $(this).data('id');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#idDeposit").val(customer.id);
            $("#fullNameDeposit").val(customer.fullName);
            $("#balanceDeposit").val(customer.balance);
            $("#transactionDeposit").val(0);

            $("#modalDeposit").modal('show')
        })
            .catch((error) => {
                console.log(error);
            });
       
    })
}

function addEventShowModalWithdraw () {
    let btnWithdraw = $(".withdraw");
    btnWithdraw.off('click');
    btnWithdraw.on("click", function () {
        customerId = $(this).data('id');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#idWithdraw").val(customer.id);
            $("#fullNameWithdraw").val(customer.fullName);
            $("#balanceWithdraw").val(customer.balance);
            $("#transactionWithdraw").val(0);

            $("#modalWithdraw").modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
       
    })
}

// addEventShowModalUpdate()

/******************** Update *************************/


function handleUpdateCustomer(){
    const btnUpdate = $('#btnUpdate');
    btnUpdate.on('click', () => {
        
        const fullName = $('#fullNameUpdate').val();
        const email = $('#emailUpdate').val();
        const phone = $('#phoneUpdate').val();
        const address = $('#addressUpdate').val();

        const obj = {
            fullName,
            email,
            phone,
            address
        }

        update(obj);
    })
}
handleUpdateCustomer()

function update(obj) {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/' + customerId,
        data: JSON.stringify(obj)
    })
        .done((data) => {
            const str = renderCustomer(data);

            const currentRow = $('#tr_' + customerId);
            currentRow.replaceWith(str);

            $('#modalUpdate').modal('hide');

            addEventShowModalUpdate();
            addEventShowModalDeposit();
            addEventShowModalWithdraw();
            addEventDeleteCustomer();
            addEventShowModalTransfer();


            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đã cập nhật thông tin',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((error) => {
            console.log(error);
        })
}
// handleUpdateCustomer()




// addEventDeleteCustomer()

/******************** Show Modal Deposit *************************/



// addEventShowModalDeposit()

/******************** Deposit *************************/

function handleDeposit(){
    const btnDeposit = $("#btnDeposit");
    btnDeposit.off('click');
    btnDeposit.on("click", () => {

        const currentBalance = customer.balance;         
        const transactionAmount = +$("#transactionDeposit").val();    
        const newBalance = currentBalance + transactionAmount;;

        if (!isNaN(transactionAmount)) {
            if (transactionAmount <= 0) {
                $("#deposit-error").text("Số tiền phải > 0");
            } else {
                if (transactionAmount > 500000000) {
                    $("#deposit-error").text("Số tiền nộp vào mỗi lần không quá 500.000.000");
                } else {

                    customer.balance = newBalance;

                    $.ajax({
                        headers: {
                            'accept': 'application/json',
                            'content-type': 'application/json'
                        },
                        type: 'PATCH',
                        url: 'http://localhost:3000/customers/' + customerId,
                        data: JSON.stringify(customer)
                    })
                        .done((data) => {

                            const str = renderCustomer(data);
                            const currentRow = $('#tr_' + customerId);
                            currentRow.replaceWith(str);
                            
                            $("#balanceDeposit").val(newBalance);
                            $("#deposit-error").text("");
                            
                            addEventShowModalUpdate();
                            addEventShowModalDeposit();
                            addEventShowModalWithdraw();
                            addEventDeleteCustomer();
                            addEventShowModalTransfer();

                            // $('#modalDeposit').modal('hide');

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Nạp tiền thành công',
                                showConfirmButton: true,
                                timer: 1500
                            })

                        })
                        .fail((error) => {
                            console.log(error);
                        })
                
                const obj = {
                    customerId,
                    transactionAmount
                }
        
                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'POST',
                    url: 'http://localhost:3000/deposits',
                    data: JSON.stringify(obj)
                })
                    .done((data) => { 

                    })
                    .fail((error) => {
                        console.log(error);
                    })    
               
                }
            }
        } else {
            $("#deposit-error").text("Sai định dạng");
        }
})
}
handleDeposit()



// addEventShowModalWithdraw()

/******************** Withdraw *************************/

function handleWithdraw(){
    const btnWithdraw = $("#btnWithdraw");
    btnWithdraw.off('click');
    btnWithdraw.on("click", () => {

        const currentBalance = customer.balance;         
        let transactionAmount = +$("#transactionWithdraw").val();    
        let newBalance;

        if (!isNaN(transactionAmount)) {
            if (transactionAmount <= 0) {
                $("#withdraw-error").text("Số tiền phải > 0");
            } else {
                if (transactionAmount > 500000000) {
                    $("#withdraw-error").text("Số tiền rút mỗi lần không quá 500.000.000");
                } else {

                    newBalance = currentBalance - transactionAmount;
                    customer.balance = newBalance;

                    $.ajax({
                        headers: {
                            'accept': 'application/json',
                            'content-type': 'application/json'
                        },
                        type: 'PATCH',
                        url: 'http://localhost:3000/customers/' + customerId,
                        data: JSON.stringify(customer)
                    })
                        .done((data) => {

                            const str = renderCustomer(data);
                            const currentRow = $('#tr_' + customerId);
                            currentRow.replaceWith(str);
                            
                            $("#balanceWithdraw").val(newBalance);
                            $("#withdraw-error").text("");
                            
                            // $('#modalWithdraw').modal('hide');

                            addEventShowModalUpdate();
                            addEventShowModalDeposit();
                            addEventShowModalWithdraw();
                            addEventDeleteCustomer();
                            addEventShowModalTransfer();

                            const obj = {
                                customerId,
                                transactionAmount
                            }

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Rút tiền thành công',
                                showConfirmButton: false,
                                timer: 1500
                            })

                            $.ajax({
                                headers: {
                                    'accept': 'application/json',
                                    'content-type': 'application/json'
                                },
                                type: 'POST',
                                url: 'http://localhost:3000/withdraws',
                                data: JSON.stringify(obj)
                            })
                                .done((data) => { 

                                })
                                .fail((error) => {
                                    console.log(error);
                                })

                        })
                        .fail((error) => {
                            console.log(error);
                        })

                }
            }
        } else {
            $("#deposit-error").text("Sai định dạng");
        }

})
}
handleWithdraw()




function getRecipients(customerId) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/customers?id_ne=' + customerId,
        
    })
    .done((data) => {
        const select = $("#recipientId");
        select.empty();
        $("<option>").val("-1").text('--- Chọn người nhận ---').appendTo("#recipientId");
        data.forEach((item) => {
                $("<option>").val(item.id).text('(' + item.id + ') ' + item.fullName).appendTo("#recipientId");
                // const option = document.createElement("option");
                // option.value = item.id;
                // option.text = "(" + item.id + ")" + " " + item.fullName;
                // select.appendChild(option);
        });
    })
    .fail((error) => {
        console.log(error);
    })
         
}


function addEventShowModalTransfer () {
    const btnTransfer = $(".transfer");

    btnTransfer.on("click", function () {
            customerId = $(this).data('id');
            getCustomerById(customerId).then((data) => {
                console.log(data);
                if (data != null) {
                    $("#senderId").val(data.id);
                    $("#senderFullName").val(data.fullName);
                    $("#senderEmail").val(data.email);
                    $("#senderBalance").val(data.balance);
                    getRecipients(customerId);
                    $("#fees").val(10);
                    $('#transferAmount').val(0);

                    $('#modalTransfer').modal('show');

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Không tìm thấy khách hàng',
                        showConfirmButton: true,
                        timer: 1500
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
        })
}
addEventShowModalTransfer();


function handleTransfer(){
    const btnTransfer = $('#btnTransfer');
    btnTransfer.off('click');

    btnTransfer.on("click", function(){
    getCustomerById(customerId).then((data) => {
        let sender = data;
        let senderBalance = sender.balance;
        const transferAmount = +$('#transferAmount').val();
        const fees = 10;
        const feesAmount = transferAmount * fees / 100;
        const transactionAmount = transferAmount + feesAmount;
        const senderNewBalance = senderBalance - transactionAmount;


        const recipientId = +$("#recipientId").val();
        console.log(recipientId);
        getCustomerById(recipientId).then((data) => {
            let recipient = data;
            const recipientBalance = recipient.balance;
            const recipientNewBalance = recipientBalance + transferAmount;

            if (sender.id === recipient.id) {
                $("#transfer-name-error").text("Người nhận không hợp lệ");
            } else {
                
                if (!isNaN(transferAmount)) {
                    if (transferAmount <= 0) {
                        $("#transfer-error").text("Số tiền phải > 0");
                    } else {
            
                        if (transactionAmount > 500000000) {
                            $("#transfer-error").text("Số tiền giao dịch tối đa 500.000.000");
                        } else {
                            if (transactionAmount > sender.balance) {
                                $("#transfer-error").text("Số dư không đủ để thực hiện giao dịch");
                            } else {
                                                    
                                sender.balance = senderNewBalance;
                                recipient.balance = recipientNewBalance;
                                
                                const transfer = {
                                    senderId: sender.id,
                                    recipientId: recipient.id,
                                    fees,
                                    transferAmount,
                                    feesAmount,
                                    transactionAmount
                                }
                                console.log(sender.id);
                                console.log(recipient.id);

                                $.ajax({
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/json'
                                    },
                                    type: 'PATCH',
                                    url: 'http://localhost:3000/customers/' + recipient.id,
                                    data: JSON.stringify(recipient)
                                })
                                    .done((data) => {
                                        const str = renderCustomer(data);
                                        const currentRow = $('#tr_' + recipient.id);
                                        currentRow.replaceWith(str);
                                    })
                                    .fail((error) => {
                                        console.log(error);
                                    })

                                $.ajax({
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/json'
                                    },
                                    type: 'PATCH',
                                    url: 'http://localhost:3000/customers/' + sender.id,
                                    data: JSON.stringify(sender)
                                })
                                    .done((data) => {
                                        const str = renderCustomer(data);
                                        const currentRow = $('#tr_' + sender.id);
                                        currentRow.replaceWith(str); 

                                        $("#senderBalance").val(senderNewBalance);
                                        $("#transfer-error").text("");
                                        $("#transfer-name-error").text("");

                                        addEventShowModalUpdate();
                                        addEventShowModalDeposit();
                                        addEventShowModalWithdraw();
                                        addEventDeleteCustomer();
                                        addEventShowModalTransfer();
            
                                        // $('#modalTransfer').modal('hide');
            
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: 'Chuyển tiền thành công',
                                            showConfirmButton: true,
                                            timer: 1500
                                        })
                                    })
                                    .fail((error) => {
                                        console.log(error);
                                    })

                                    $.ajax({
                                        type: 'POST',
                                        headers: {
                                            'accept': 'application/json',
                                            'content-type': 'application/json'
                                        },
                                        url: 'http://localhost:3000/transfers',
                                        data: JSON.stringify(transfer)
                                    }) 
                                }                            
            
                            }                                       
                         }
            
                } else {
                    $("#transfer-error").text("Sai định dạng");
                }
            }
        });
    })


    })
}
handleTransfer()

/******************** Delete *************************/


function addEventDeleteCustomer() {
	const btnDelete = $(".delete");
    btnDelete.off('click');
    btnDelete.on('click', function () {
        customerId = $(this).data('id');
            
        // const obj = {
        //     deleted: 1
        // }
        let cf = confirm('Bạn chắc chắn muốn xoá?');
        if (cf) {
        
            $.ajax({
                type: 'PATCH',
                url: "http://localhost:3000/customers/" + customerId,
                data: {
                    deleted: 1
                }
            })
                .done(() => {
                    $('#tr_' + customerId).remove();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Xoá thành công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        }
	});
}




// History

function renderTransfer(obj) { 
    let sender = getCustomerById(obj.senderId);
    let recipient = getCustomerById(obj.recipientId);
    return  `
            <tr id="tr_${obj.id}">
                <td>${obj.id} </td>
                <td class="text-center">${obj.senderId} </td>
                <td>${sender.fullName} </td>
                <td class="text-center">${obj.recipientId} </td>
                <td>${recipient.fullName} </td>
                <td class="text-end">${obj.transferAmount} </td>
                <td class="text-end">${obj.fees} </td>
                <td class="text-end">${obj.feesAmount} </td>
                <td class="text-end">${obj.transactionAmount} </td>
            </tr>`;
    
}
function getAllTransfer(){
    const tbTransferBody = $("#tbTransfer tbody");

    tbTransferBody.empty();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/transfers'
    })
        .done((data) => {
            data.forEach(item => {                
                const str = renderTransfer(item);
                tbTransferBody.prepend(str);                
            });

        })
        .fail((error) => {
            console.log(error);
        })
}
getAllTransfer()


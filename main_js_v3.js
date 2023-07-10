/// <reference path="./assets/js/jquery-3.7.0.min.js" />


const page = {
    url: {
        getAllCustomers: App.API_CUSTOMER + '?deleted=0',
        createCustomer: App.API_CUSTOMER,
        getCustomerById: App.API_CUSTOMER,
        updateCustomer: App.API_CUSTOMER,
        updateBalance: App.API_CUSTOMER,
        deposit: App.API_DEPOSIT,
        withdraw: App.API_WITHDRAW,
        getRecipients: App.API_CUSTOMER + '?deleted=0' + '&id_ne=',
        deleteCustomer: App.API_CUSTOMER,
    },
    elements: {},
    loadData: {},
    commands: {},
    dialogs: {
        elements: {},
        commands: {}
    },
    initializeControlEvent: {}

}
/*
url: quản lý api
elements: quản lý các phần tử
loadData: load dữ liệu
commands: quản lý các lệnh
dialogs: quản lý các modal
ControlEvent: quản lý các sự kiện
*/

let customerId = 0;
let customer = new Customer();
let deposit = new Deposit();
let withdraw = new Withdraw();
let transfer = new Transfer();

/** Khai báo biến chứa dữ liệu table */
page.elements.btnShowCreateModal = $('#btnShowCreateModal');
page.elements.tbCustomerBody = $("#tbCustomer tbody");

/** Khai báo biến chứa dữ liệu modal Create */

page.dialogs.elements.modalCreate = $('#modalCreate');
page.dialogs.elements.formCreate = $('#formCreate');
page.dialogs.elements.fullNameCreate = $('#fullNameCreate');
page.dialogs.elements.emailCreate = $('#emailCreate');
page.dialogs.elements.phoneCreate = $('#phoneCreate');
page.dialogs.elements.addressCreate = $('#addressCreate');
page.dialogs.elements.btnCreate = $('#btnCreate');

/** Khai báo biến chứa dữ liệu modal Update */

page.dialogs.elements.modalUpdate = $('#modalUpdate');
page.dialogs.elements.fullNameUpdate = $('#fullNameUpdate');
page.dialogs.elements.emailUpdate = $('#emailUpdate');
page.dialogs.elements.phoneUpdate = $('#phoneUpdate');
page.dialogs.elements.addressUpdate = $('#addressUpdate');
page.dialogs.elements.btnUpdate = $('#btnUpdate');

/** Khai báo biến chứa dữ liệu modal Deposit */

page.dialogs.elements.modalDeposit = $('#modalDeposit');
page.dialogs.elements.fullNameDeposit = $('#fullNameDeposit');
page.dialogs.elements.emailDeposit = $('#emailDeposit');
page.dialogs.elements.balanceDeposit = $('#balanceDeposit');
page.dialogs.elements.transactionDeposit = $('#transactionDeposit');
page.dialogs.elements.btnDeposit = $('#btnDeposit');

/** Khai báo biến chứa dữ liệu modal Withdraw */

page.dialogs.elements.modalWithdraw = $('#modalWithdraw');
page.dialogs.elements.fullNameWithdraw = $('#fullNameWithdraw');
page.dialogs.elements.emailWithdraw = $('#emailWithdraw');
page.dialogs.elements.balanceWithdraw = $('#balanceWithdraw');
page.dialogs.elements.transactionWithdraw = $('#transactionWithdraw');
page.dialogs.elements.btnWithdraw = $('#btnWithdraw');

/** Khai báo biến chứa dữ liệu modal Transfer */

page.dialogs.elements.modalTransfer = $('#modalTransfer');
page.dialogs.elements.senderId = $('#senderId');
page.dialogs.elements.senderFullName = $('#senderFullName');
page.dialogs.elements.senderEmail = $('#senderEmail');
page.dialogs.elements.senderBalance = $('#senderBalance');
page.dialogs.elements.transferAmount = $('#transferAmount');
page.dialogs.elements.fees = $('#fees');
page.dialogs.elements.btnTransfer = $('#btnTransfer');






/** Render customer */

page.commands.renderCustomer = (obj) => {
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

page.commands.getAllCustomers = () => {
    
    page.elements.tbCustomerBody.empty();

    $.ajax({
        type: 'GET',
        url: page.url.getAllCustomers
    })
        .done((data) => {
            data.forEach(item => {
                const str = page.commands.renderCustomer(item);
                page.elements.tbCustomerBody.prepend(str);                
            });
        })
        .fail((error) => {
            console.log(error);
        })
}

/******************** Find *************************/

page.commands.getCustomerById = (id) => {
	return $.ajax ({
        type: 'GET',
        url: page.url.getCustomerById + '/' + id,
    });
}

/******************** Show Modal *************************/

page.commands.handleAddEventShowModalUpdate = (customerId) => {
    
    page.commands.getCustomerById(customerId).then((data) =>{
        
        page.dialogs.elements.fullNameUpdate.val(data.fullName);
        page.dialogs.elements.emailUpdate.val(data.email);
        page.dialogs.elements.phoneUpdate.val(data.phone);
        page.dialogs.elements.addressUpdate.val(data.address);

        page.dialogs.elements.modalUpdate.modal('show');
    })
        .catch((error) => {
            console.log(error);
        }); 

}

page.commands.handleAddEventShowModalDeposit = (customerId) => {

    page.commands.getCustomerById(customerId).then((data) => {
            customer = data;
            page.dialogs.elements.fullNameDeposit.val(customer.fullName);
            page.dialogs.elements.emailDeposit.val(customer.email);
            page.dialogs.elements.balanceDeposit.val(customer.balance);
            page.dialogs.elements.transactionDeposit.val(0);

            page.dialogs.elements.modalDeposit.modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
}

page.commands.handleAddEventShowModalWithdraw = (customerId) => {

    page.commands.getCustomerById(customerId).then((data) => {
            customer = data;
            page.dialogs.elements.fullNameWithdraw.val(customer.fullName);
            page.dialogs.elements.emailWithdraw.val(customer.email);
            page.dialogs.elements.balanceWithdraw.val(customer.balance);
            page.dialogs.elements.transactionWithdraw.val(0);

            page.dialogs.elements.modalWithdraw.modal('show');
        })
            .catch((error) => {
                console.log(error);
            });
}

page.commands.getRecipients = (customerId) => {
    $.ajax({
        type: 'GET',
        url: page.url.getRecipients + customerId,
        
    })
    .done((data) => {
        const select = $("#recipientId");
        select.empty();
        $("<option>").val("-1").text('--- Chọn người nhận ---').appendTo("#recipientId");
        data.forEach((item) => {
                $("<option>").val(item.id).text('(' + item.id + ') ' + item.fullName).appendTo("#recipientId");
        });
    })
    .fail((error) => {
        console.log(error);
    })
         
}

page.commands.handleAddEventShowModalTransfer = (customerId) => {
   
            page.commands.getCustomerById(customerId).then((data) => {
                if (data != null) {
                    page.dialogs.elements.senderId.val(data.id);
                    page.dialogs.elements.senderFullName.val(data.fullName);
                    page.dialogs.elements.senderEmail.val(data.email);
                    page.dialogs.elements.senderBalance.val(data.balance);
                    page.commands.getRecipients(customerId);

                    page.dialogs.elements.transferAmount.val(0);
                    page.dialogs.elements.fees.val(10);
                    

                    page.dialogs.elements.modalTransfer.modal('show');

                } else {
                    App.showErrorAlert('Không tìm thấy khách hàng');
                }
            })
            .catch((error) => {
                console.log(error);
            });
}

/******************** Handle *************************/



page.dialogs.commands.update = (obj) => {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.url.updateCustomer + '/' + customerId,
        data: JSON.stringify(obj)
    })
        .done((data) => {
            const str = page.commands.renderCustomer(data);

            const currentRow = $('#tr_' + customerId);
            currentRow.replaceWith(str);

            page.dialogs.elements.modalUpdate.modal('hide');

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


page.dialogs.commands.deposit = (customer, deposit) => {

    if (!isNaN(deposit.transactionAmount)) {
        if (deposit.transactionAmount <= 0) {
            $("#deposit-error").text("Số tiền phải > 0");
        } else {
            if (deposit.transactionAmount > 500000000) {
                $("#deposit-error").text("Số tiền nộp vào mỗi lần không quá 500.000.000");
            } else {
                
                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'PATCH',
                    url: page.url.updateBalance + '/' + customerId,
                    data: JSON.stringify(customer)
                })
                    .done((data) => {

                        const str = page.commands.renderCustomer(data);
                        const currentRow = $('#tr_' + customerId);
                        currentRow.replaceWith(str);
                        
                        $("#balanceDeposit").val(customer.balance);
                        $("#deposit-error").text("");
                        
                        page.dialogs.elements.modalDeposit.modal('hide');

                        App.showSuccessAlert('Nạp tiền thành công');
                        
                    })
                    .fail((error) => {
                        console.log(error);
                    })
            
                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'POST',
                    url: page.url.deposit,
                    data: JSON.stringify(deposit)
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
    

}

page.dialogs.commands.withdraw = (customer, withdraw) => {

    if (!isNaN(withdraw.transactionAmount)) {
        if (withdraw.transactionAmount <= 0) {
            $("#withdraw-error").text("Số tiền phải > 0");
        } else {
            if (withdraw.transactionAmount > 500000000) {
                $("#withdraw-error").text("Số tiền rút mỗi lần không quá 500.000.000");
            } else {
                
                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'PATCH',
                    url: page.url.updateBalance + '/' + customerId,
                    data: JSON.stringify(customer)
                })
                    .done((data) => {

                        const str = page.commands.renderCustomer(data);
                        const currentRow = $('#tr_' + customerId);
                        currentRow.replaceWith(str);
                        
                        $("#balanceWithdraw").val(customer.balance);
                        $("#withdraw-error").text("");
                        
                        page.dialogs.elements.modalWithdraw.modal('hide');

                        App.showSuccessAlert('Rút tiền thành công');
                        
                    })
                    .fail((error) => {
                        console.log(error);
                    })
            
                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'POST',
                    url: page.url.withdraw,
                    data: JSON.stringify(withdraw)
                })
                    .done((data) => { 

                    })
                    .fail((error) => {
                        console.log(error);
                    })             
            }
        }
    } else {
        $("#withdraw-error").text("Sai định dạng");
    }
    

}


page.dialogs.commands.transfer = () => {
    page.commands.getCustomerById(customerId).then((data) => {
        let sender = data;
        let senderBalance = sender.balance;
        const transferAmount = +$('#transferAmount').val();
        const fees = 10;
        const feesAmount = transferAmount * fees / 100;
        const transactionAmount = transferAmount + feesAmount;
        const senderNewBalance = senderBalance - transactionAmount;


        const recipientId = +$("#recipientId").val();
        console.log(recipientId);
        page.commands.getCustomerById(recipientId).then((data) => {
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
                                
                                transfer = {
                                    senderId: sender.id,
                                    recipientId: recipient.id,
                                    fees,
                                    transferAmount,
                                    feesAmount,
                                    transactionAmount
                                }

                                $.ajax({
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/json'
                                    },
                                    type: 'PATCH',
                                    url: page.url.updateBalance + '/' + recipient.id,
                                    data: JSON.stringify(recipient)
                                })
                                    .done((data) => {
                                        const str = page.commands.renderCustomer(data);
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
                                    url: page.url.updateBalance + '/' + sender.id,
                                    data: JSON.stringify(sender)
                                })
                                    .done((data) => {
                                        const str = page.commands.renderCustomer(data);
                                        const currentRow = $('#tr_' + sender.id);
                                        currentRow.replaceWith(str); 

                                        $("#senderBalance").val(senderNewBalance);
                                        $("#transfer-error").text("");
                                        $("#transfer-name-error").text("");

            
                                        page.dialogs.elements.modalTransfer.modal('hide');
            
                                        App.showSuccessAlert('Chuyển tiền thành công');
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


}

/******************** Delete *************************/

page.commands.handleDeleteCustomer = (customerId) => {	
                
        // const obj = {
        //     deleted: 1
        // }
        let cf = confirm('Bạn chắc chắn muốn xoá?');
        if (cf) {
        
            $.ajax({
                type: 'PATCH',
                url: page.url.deleteCustomer + '/' + customerId,
                data: {
                    deleted: 1
                }
            })
                .done(() => {
                    $('#tr_' + customerId).remove();
                    App.showSuccessAlert('Xoá thành công');
                })
        }
}


page.dialogs.commands.create = () => {
    const fullName = page.dialogs.elements.fullNameCreate.val();
    const email = page.dialogs.elements.emailCreate.val();
    const phone = page.dialogs.elements.phoneCreate.val();
    const address = page.dialogs.elements.addressCreate.val();
    const balance = 0;
    const deleted = 0;

    const obj = {
        fullName, 
        email, 
        phone, 
        address, 
        balance, 
        deleted
    }

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type':  'application/json'
        },
        type: "POST",
        url: page.url.createCustomer,
        data: JSON.stringify(obj)
    })
        .done((data) => {
            const str = page.commands.renderCustomer(data);                
            page.elements.tbCustomerBody.prepend(str);

            $('#createModal').modal('hide');

            
            // Swal.fire({
            //     position: 'center',
            //     icon: 'success',
            //     title: 'Thêm khách hàng thành công',
            //     showConfirmButton: false,
            //     timer: 1500
            // })

            // let formValue = $(".form-control");
            // for (var i = 0; i < formValue.length; i++) {
            //     formValue[i].val("");
            // }
            
        })
        .fail((error) => {
            console.log(error);
        });   
}



/** Quản lý các sự kiện */

page.initializeControlEvent = () => {
    page.elements.btnShowCreateModal.on('click', () => {
        page.dialogs.elements.modalCreate.modal('show');
    })

    page.dialogs.elements.btnCreate.on('click', () => {
        page.dialogs.commands.create();
    })
    page.dialogs.commands.closeModalCreate = () => {
        page.dialogs.elements.formCreate[0].reset();
    }

    page.elements.tbCustomerBody.on('click', '.edit', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalUpdate(customerId);
    })

    page.elements.tbCustomerBody.on('click', '.deposit', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalDeposit(customerId);
    })
    page.elements.tbCustomerBody.on('click', '.withdraw', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalWithdraw(customerId);
    })
    page.elements.tbCustomerBody.on('click', '.transfer', function () {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalTransfer(customerId);
    })
    page.elements.tbCustomerBody.on('click', '.delete', function () {
        customerId = $(this).data('id');
        page.commands.handleDeleteCustomer(customerId);
    })

/** Update */

    page.dialogs.elements.btnUpdate.on('click', ()  => {
        const fullName =  page.dialogs.elements.fullNameUpdate.val();
        const email =  page.dialogs.elements.emailUpdate.val();
        const phone =  page.dialogs.elements.phoneUpdate.val();
        const address = page.dialogs.elements.addressUpdate.val();

        customer.fullName = fullName;
        customer.email = email;
        customer.phone = phone;
        customer.address = address;

        page.dialogs.commands.update(customer);
    })
/** Deposit */

    page.dialogs.elements.btnDeposit.on('click', () => {
        const currentBalance = customer.balance;         
        const transactionAmount = +$("#transactionDeposit").val();    
        const newBalance = currentBalance + transactionAmount;
        customer.balance = newBalance;

        deposit.id = null;
        deposit.customerId = customerId;
        deposit.transactionAmount = transactionAmount; 
    
        page.dialogs.commands.deposit(customer, deposit);
    })  

/** Withdraw */

    page.dialogs.elements.btnWithdraw.on('click', () => {
        const currentBalance = customer.balance;         
        const transactionAmount = +$("#transactionWithdraw").val();    
        const newBalance = currentBalance - transactionAmount;
        customer.balance = newBalance;

        withdraw.id = null;
        withdraw.customerId = customerId;
        withdraw.transactionAmount = transactionAmount; 
    
        page.dialogs.commands.withdraw(customer, withdraw);
    })
/** Transfer */

    page.dialogs.elements.btnTransfer.on('click', () => {

        page.dialogs.commands.transfer();
    })


    /** Đóng modal: reset form */
    page.dialogs.elements.modalCreate.on("hidden.bs.modal", function () {
        page.dialogs.commands.closeModalCreate();
    })
}

page.loadData = () => {
    page.commands.getAllCustomers()
}

/**  Window onload **/

$(() => {
    page.loadData();

    page.initializeControlEvent();


})



// History

function renderTransfer(transfer, sender, recipient) {     
     return `<tr id="tr_${transfer.id}">
                <td>${transfer.id} </td>
                <td class="text-center">${transfer.senderId} </td>
                <td>${sender.fullName} </td>
                <td class="text-center">${transfer.recipientId} </td>
                <td>${recipient.fullName} </td>
                <td class="text-end">${transfer.transferAmount} </td>
                <td class="text-end">${transfer.fees} </td>
                <td class="text-end">${transfer.feesAmount} </td>
                <td class="text-end">${transfer.transactionAmount} </td>
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
                let sender = new Customer();
                let recipient = new Customer();
                page.commands.getCustomerById(item.senderId).then((data) => {
                    sender = data;
                    page.commands.getCustomerById(item.recipientId).then((data) => {
                        recipient = data;

                        const str = renderTransfer(item, sender, recipient);
                        tbTransferBody.prepend(str);
                    });      
                });              
                    
                           
            });

        })
        .fail((error) => {
            console.log(error);
        })
}
getAllTransfer()
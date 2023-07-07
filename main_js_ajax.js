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
    setBalance(newBalance) {
        this.balance = newBalance;
    }
}

let id = 1;
let customerId = 0;

const customers = [
	new Customer(id++, "Nguyên", "nguyen@gmail.com", "0123", "Phú thượng", 100, 0),
	new Customer(id++, "Phước", "phuoc@gmail.com", "0123", "Huế", 0, 0),
];

function findMaxId(customers) {
	let maxId = 0;
	for (let i = 0; i < customers.length; i++) {
		if (customers[i].id > maxId) {
			maxId = customers[i].id;
		}
	}
	return ++maxId;
}

function renderCustomer(obj) { 
    return  `<tr>
                <td>${obj.id} </td>
                <td>${obj.fullName} </td>
                <td>${obj.email} </td>
                <td>${obj.phone} </td>
                <td>${obj.address} </td>
                <td>${obj.balance}</td>
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
    const bodyDiv = document.querySelector("#body-customer");
    bodyDiv.innerHTML = "";

    customers.forEach(item => {
        const str = renderCustomer(item);
        bodyDiv.innerHTML += str;
    });
}

getAllCustomers();


/******************** Create *************************/
function handleCreate () {
    const btnCreate = document.getElementById("btnCreate");
    btnCreate.addEventListener("click", function () {

        let id = findMaxId(customers);
        const fullName = document.getElementById("fullNameCreate").value;
        const email = document.getElementById("emailCreate").value;
        const phone = document.getElementById("phoneCreate").value;
        const address = document.getElementById("addressCreate").value;

        const c = {
            id,
            fullName,
            email,
            phone,
            address,
            balance: 0,
            delete: 0
        };
        customers.push(c);
        getAllCustomers();
        addEventDeleteCustomer();
        addEventShowModalUpdate();
        addEventShowModalDeposit()
        addEventShowModalTransfer()


        let formValue = document.getElementsByClassName("form-control");
        for (var i = 0; i < formValue.length; i++) {
            formValue[i].value = "";
        }
});
}
handleCreate()

/******************** Find *************************/
function getCustomerById(id) {
	// return customers.find(item => item.id == id);
	for (let i = 0; i < customers.length; i++) {
		if (customers[i].id == id) {
			return customers[i];
		}
	}
	return null;
}

function findCustomerIndexById(id) {
    let index = -1;

    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
            index = i;
        }
    }

    return index;
}
/******************** Show Update *************************/

function addEventShowModalUpdate(){
    const btnUpdate = document.querySelectorAll(".edit");
    btnUpdate.forEach((item) => {
        item.addEventListener("click", function () {
            customerId = +item.getAttribute("data-id");
            const customer = getCustomerById(customerId);

            document.getElementById("fullNameUpdate").value = customer.fullName;
            document.getElementById("emailUpdate").value = customer.email;
            document.getElementById("phoneUpdate").value = customer.phone;
            document.getElementById("addressUpdate").value = customer.address;
            
            const modalUpdate = new bootstrap.Modal(document.getElementById('modalUpdate'), {
                keyboard: false
            })
            modalUpdate.show()
        })
    })
}

addEventShowModalUpdate()

/******************** Update *************************/

function handleUpdateCustomer(){
    const btnUpdate = document.getElementById('btnUpdate');
    btnUpdate.addEventListener('click', function () {
    
    const fullName = document.getElementById('fullNameUpdate').value;
    const email = document.getElementById('emailUpdate').value;
    const phone = document.getElementById('phoneUpdate').value;
    const address = document.getElementById('addressUpdate').value;
    const c = getCustomerById(customerId);
    const balance = c.balance;
    const customer = {
        id: customerId,
        fullName,
        email,
        phone,
        address,
        balance,
        deleted: 0
    }

    const index = findCustomerIndexById(customerId);

    customers[index] = customer;

    getAllCustomers()

    addEventShowModalUpdate()
    addEventDeleteCustomer()
    addEventShowModalDeposit()
    addEventShowModalTransfer()


})
}

handleUpdateCustomer()


/******************** Delete *************************/

function addEventDeleteCustomer() {
	const btnDelete = document.querySelectorAll(".delete");

	btnDelete.forEach((item) => {
		item.addEventListener("click", function () {
			customerId = +item.getAttribute("data-id");
			let cf = confirm("Bạn chắc chắn muốn xoá?");
			if (cf) {
				for (var i = 0; i < customers.length; i++) {
					if (customers[i].id === customerId) {
						customers.splice(i, 1);
					}
				}
			}
			getAllCustomers()
            addEventShowModalUpdate()
            addEventDeleteCustomer()
            addEventShowModalDeposit()
            addEventShowModalTransfer()


		});
	});
}

addEventDeleteCustomer()

/******************** Show Modal Deposit *************************/

function addEventShowModalDeposit () {
    const btnDeposit = document.querySelectorAll(".deposit");

    btnDeposit.forEach((item) => {
        item.addEventListener("click", function () {
            customerId = +item.getAttribute("data-id");
            var customer = getCustomerById(customerId);
   
            document.getElementById("idDeposit").value = customer.id;
            document.getElementById("fullNameDeposit").value = customer.fullName;
            document.getElementById("balanceDeposit").value = customer.balance;
            // document.getElementById("transactionDeposit").value = 0;

            const modalDeposit = new bootstrap.Modal(document.getElementById('modalDeposit'), {
                keyboard: false
            })
            modalDeposit.show()
        })
    })

}

addEventShowModalDeposit()

/******************** Deposit *************************/

function handleDeposit(){
    const btnDeposit = document.getElementById("btnDeposit");

    btnDeposit.addEventListener("click", function () {

    var customer = getCustomerById(customerId);  

    let transactionAmount = +document.getElementById("transactionDeposit").value;    
    let newBalance;

    if (!isNaN(transactionAmount)) {
        if (transactionAmount <= 0) {
            document.getElementById("deposit-error").innerText = "Số tiền phải > 0";
        } else {
            if (transactionAmount > 500000000) {
                document.getElementById("deposit-error").innerText = "Số tiền nộp vào mỗi lần không quá 500.000.000";
            } else {
                newBalance = customer.balance + transactionAmount;
                console.log(newBalance);
                customer.setBalance(newBalance);
                document.getElementById("balanceDeposit").value = newBalance;
                document.getElementById("deposit-error").innerText = "";

            }
        }
    } else {
        document.getElementById("deposit-error").innerText = "Không được nhập chữ";
    }

    getAllCustomers()

    addEventShowModalUpdate();
    addEventDeleteCustomer()
    addEventShowModalDeposit()
    addEventShowModalTransfer()

})
}
handleDeposit()


function addEventShowModalTransfer () {
    const btnTransfer = document.querySelectorAll(".transfer");

    btnTransfer.forEach((item) => {
        item.addEventListener("click", function () {

            customerId = +item.getAttribute("data-id");
            var sender = getCustomerById(customerId);
   
            document.getElementById("senderId").value = sender.id;
            document.getElementById("senderFullName").value = sender.fullName;
            document.getElementById("senderEmail").value = sender.email;
            document.getElementById("senderBalance").value = sender.balance;
            document.getElementById("fees").value = 10;
            
            const select = document.getElementById("recipientId");
            select.innerHTML="";

            customers.forEach((customer) => {
                if (customer.id != sender.id) {
                    const option = document.createElement("option");
                    option.value = customer.id;
                    option.text = "(" + customer.id + ")" + " " + customer.fullName;
                    select.appendChild(option);
                }

            });

            const modalTransfer = new bootstrap.Modal(document.getElementById('modalTransfer'), {
                keyboard: false
            })
            modalTransfer.show()
        })
    })

}
addEventShowModalTransfer();


function handleTransfer(){
    const btnTransfer = document.getElementById('btnTransfer')

    btnTransfer.addEventListener("click", function(){
    var sender = getCustomerById(customerId);
    console.log("sender " + sender);

    var recipientId = +document.getElementById("recipientId").value;
    var recipient = getCustomerById(recipientId);
    console.log("recipient " + recipient);
    
    if (sender.id === recipient.id) {
        document.getElementById("transfer-name-error").innerText = "Người nhận không hợp lệ";
    } else {
        var transferAmount = +document.getElementById("transferAmount").value;
        var fees = 0.1;
        
        if (!isNaN(transferAmount)) {
            if (transferAmount <= 0) {
                document.getElementById("transfer-error").innerText = "Số tiền phải > 0";
            } else {
                var feesAmount = parseFloat(transferAmount * fees);
                var transactionAmount = transferAmount + feesAmount;
    
                if (transactionAmount > 500000000) {
                    document.getElementById("transfer-error").innerText = "Số tiền giao dịch tối đa 500.000.000";
                } else {
                    if (transactionAmount > sender.balance) {
                        document.getElementById("transfer-error").innerText = "Số dư không đủ để thực hiện giao dịch";
                    } else {
                        var newBalance = sender.balance - transactionAmount;
            
                        sender.setBalance(newBalance);
                        recipient.setBalance(recipient.balance + transferAmount);
                        
                        document.getElementById("senderBalance").value = newBalance;
                        document.getElementById("transfer-error").innerText = "";
                        document.getElementById("transfer-name-error").innerText = "";

                    }
    
                }
            }
    
        } else {
            document.getElementById("transfer-error").innerText = "Không được nhập chữ";
        }
    }

    

    getAllCustomers()

    addEventShowModalUpdate();
    addEventDeleteCustomer()    
    addEventShowModalDeposit()
    addEventShowModalTransfer();

})
}
handleTransfer()


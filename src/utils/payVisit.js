import axios from "./axiosInstance";
export const handlePay = (id) =>{
    axios.get(`/visit/pay/${id}`).then(res => {

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.liqpay.ua/api/3/checkout';
        form.target = '_blank';
        form.acceptCharset = 'utf-8';
        const dataInput = document.createElement('input');
        dataInput.type = 'hidden';
        dataInput.name = 'data';
        dataInput.value = res.data.data;
        const signatureInput = document.createElement('input');
        signatureInput.type = 'hidden';
        signatureInput.name = 'signature';
        signatureInput.value = res.data.signature;

        form.appendChild(dataInput);
        form.appendChild(signatureInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    })

}

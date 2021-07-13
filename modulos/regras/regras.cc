// regras.cc
#include <node.h>
#include <string>
#include <iostream>

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Number;
using v8::Integer;
using v8::Array;
using v8::Exception;

void calcularItemPreco(const FunctionCallbackInfo<Value>& args) {

    Isolate* isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    double desc=5.0;
    int codigo = args[0].As<Number>()->Value();

    Local<Function> gui_consulta = Local<Function>::Cast(args[1]);  
    const unsigned argc = 1;   
    std::string  query = "SELECT produto, pf0 as preco FROM produto WHERE id = " + std::to_string(codigo);
    Local<Value> consulta = String::NewFromUtf8(isolate, query.c_str()).ToLocalChecked();
    Local<Value> argv[argc] = {
         consulta
    };
    double retPreco = gui_consulta->Call(context, Null(isolate), argc, argv).ToLocalChecked().As<Number>()->Value();
    args.GetReturnValue().Set(retPreco);
}

/*
https://stackoverflow.com/questions/40533193/v8-c-how-to-get-object-key-values-provided-as-arguments
*/
void calcularTotalPedido(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();
    Local<Function> gui_log = Local<Function>::Cast(args[1]);
    double retPreco = 0.0;
    const unsigned argc = 1;   
    Local<Value> argv[argc] = {
         String::NewFromUtf8(isolate, "calcularTotalPedido").ToLocalChecked()
    };
    gui_log->Call(context, Null(isolate), argc, argv);
    
    std::cout << "Listando os itens do objeto\n";
    Local<Object> obj = args[0].As<Object>();    
    Local<Value> keyValor = String::NewFromUtf8(isolate, "valor").ToLocalChecked();
    retPreco = obj->Get(context, keyValor).ToLocalChecked().As<Number>()->Value();    

    Local<Value> keyItem = String::NewFromUtf8(isolate, "item").ToLocalChecked();
    Local<Value> itens = obj->Get(context, keyItem).ToLocalChecked(); 
    Local<Array> vitens = Local<Array>::Cast(itens); 
    Local<Value> keyItemQuantidade = String::NewFromUtf8(isolate, "quantidade").ToLocalChecked();
    Local<Value> keyItemPreco = String::NewFromUtf8(isolate, "preco").ToLocalChecked();
    for (uint32_t i = 0; i < vitens->Length(); ++i) {
        Local<Object> itp = vitens->Get(context, i).ToLocalChecked().As<Object>();
        int itemqtd = itp->Get(context, keyItemQuantidade).ToLocalChecked().As<Number>()->Value();
        double itempc = itp->Get(context, keyItemPreco).ToLocalChecked().As<Number>()->Value();
        //std::cout << std::to_string(itemqtd) << " - " << std::to_string(itemqtd) << "\n";
        double valorItem = itemqtd * itempc;
        retPreco += valorItem;
    }
    args.GetReturnValue().Set(retPreco);

}

void Initialize(Local<Object> exports){
    NODE_SET_METHOD(exports,"calcularItemPreco", calcularItemPreco);
    NODE_SET_METHOD(exports,"calcularTotalPedido", calcularTotalPedido);
}

NODE_MODULE(addon, Initialize)
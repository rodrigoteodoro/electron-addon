// regras.cc
#include <node.h>
#include <string>

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Number;
using v8::Integer;

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

void Initialize(Local<Object> exports){
    NODE_SET_METHOD(exports,"calcularItemPreco", calcularItemPreco);
}

NODE_MODULE(addon, Initialize)
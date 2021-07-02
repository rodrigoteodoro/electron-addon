// regras.cc
#include <node.h>

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

void Desconto(const FunctionCallbackInfo<Value>& args) {

    Isolate* isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    double desc=5.0;
    double preco = args[0].As<Number>()->Value();
    int codigo = args[1].As<Number>()->Value();

    Local<Function> getPreco = Local<Function>::Cast(args[2]);  
    const unsigned argc = 1;   
    Local<Value> argv[argc] = {
         Integer::New(isolate, codigo)
    };
    double retPreco = getPreco->Call(context, Null(isolate), argc, argv).ToLocalChecked().As<Number>()->Value();

    args.GetReturnValue().Set(retPreco);

}

void Initialize(Local<Object> exports){
    NODE_SET_METHOD(exports,"desconto", Desconto);
}

NODE_MODULE(addon, Initialize)
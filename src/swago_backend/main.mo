// import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Array "mo:base/Array";
// import Option "mo:base/Option";
// import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
// import Types "./Types";
// import Result "mo:base/Result";
// import HashMap "mo:base/HashMap";
import Blob "mo:base/Blob";

actor {
  stable var custodians = List.nil<Principal>();   
  let null_address : Principal = Principal.fromText("aaaaa-aa");

  public type Mail_id = {
    mailId:Text;
  };

    var UserMail: [Mail_id] = [];

    public func addUsermail(mail:Mail_id): async Text {
      UserMail :=Array.append<Mail_id>(UserMail, [mail]);
      return "Registered successfully"
    };

    public shared query func getAllMails(): async [Mail_id] {
      return UserMail;
    };

    public shared query func CheckLogin_By_Mail(mailId:Text): async ?Mail_id{
      return Array.find<Mail_id>(UserMail , func x=x.mailId == mailId);
    };

    public type Create_Betting = {
      mail:Text;
      name :Text;
      question:Text;
      set_timing:Nat64;
      image:Blob;
      twitter_link:Text;
      telegram_link:Text;
      website_link:Text;
      countdown_style:Nat64;
    };

    var user_Betting:[Create_Betting] = [];

    public func add_Betting(betting :Create_Betting ):async Text {
      user_Betting := Array.append<Create_Betting>(user_Betting , [betting]);
      return "Betting Created";
    };

    public shared query func get_All_Bettings() : async [Create_Betting] {
      return user_Betting ;
    };

    public shared query func get_My_Bettings(mail:Text): async [Create_Betting] {
      return Array.filter<Create_Betting>(user_Betting ,  func x=x.mail == mail);
    };

    public shared (msg) func whoami() : async Principal {
        msg.caller
    };

};
import argparse
import os
from xmlrpc.client import boolean
from prettytable import PrettyTable

class Dredd:
    def __init__(self, endpoint, user, path, test_name, test_pass):
        if endpoint is not None:
            self.endpoint = endpoint
        else:     
            self.endpoint = "https://127.0.0.1:9200"

        if user is not None:
            self.user = user
        else:
            self.user = "admin:admin"

        if path is not None:
            self.path = path
        else:
            self.path = ""    

        if test_name is not None:
            self.test_name  = test_name 
        else:
            self.test_name = ""  

        if test_pass is not None:
            self.test_pass  = test_pass 
        else:
            self.test_pass = False     

    def write_file(self): 
        file_obj = open("url.txt", mode='w', encoding='utf-8') 
        text = self.endpoint + " " + self.user 
        file_obj.write(text)
        file_obj.seek(0,0)
        file_obj.close()

    def dredd_work(self):
        # Walking in test directory tree and runing dredd framework.
        test_failed_count = 0
        test_passed_count = 0
        test_failed = []
        test_passed = []
        test_passes = PrettyTable()
        test_fails = PrettyTable()
        for dirpath, dirnames, files in os.walk("../models"+self.path):
            curr_path = dirpath.split('/')
            curr_dir = curr_path[len(curr_path)-1]
            if files:
                command = "dredd " + dirpath +"/"+ files[1]+ " " + self.endpoint+ " --user=" + self.user + " --hookfiles=" + dirpath + "/" + files[0]
                if self.test_name != "":
                    if self.test_name == curr_dir:
                        if(os.system(command)): 
                            test_failed_count = test_failed_count + 1
                            test_failed.append([curr_dir,dirpath])
                        else:
                            test_passed_count = test_passed_count + 1
                            test_passed.append([curr_dir,dirpath])                                  
                else:
                    if(os.system(command)):
                        test_failed_count = test_failed_count + 1
                        test_failed.append([curr_dir,dirpath])
                    else:
                        test_passed_count = test_passed_count + 1
                        test_passed.append([curr_dir,dirpath]) 
        print("Total number of test cases: ", test_failed_count + test_passed_count )
        print("Test Passed: ",test_passed_count)
        print("Test failed: ",test_failed_count)
        if self.test_pass == True:
            test_passes.field_names = ["Model Name", "Directory Path"]
            test_passes.add_rows(test_passed)
            test_passes.align='l'
            print("Results: Test cases passed.",test_passes,sep="\n")

        if test_failed_count != 0:
            test_fails.field_names = ["Model Name", "Directory Path"]
            test_fails.add_rows(test_failed)
            test_fails.align='l'
            print("Results: Test cases failed.",test_fails,sep="\n")

        # Removing temporary-credentials file.
        os.remove('url.txt')

        return len(test_failed)       


# Parsing command line arguments:
parser = argparse.ArgumentParser()

parser.add_argument('--endpoint', type=str, required=False)
parser.add_argument('--user', type=str, required=False)
parser.add_argument('--path', type=str, required=False)
parser.add_argument('--testname', type=str, required=False)
parser.add_argument('--testpass', type=bool, required=False)
args = parser.parse_args()

# Check whether default arguments provided by user:
obj = Dredd(args.endpoint, args.user, args.path, args.testname, args.testpass )

# Creating a intermediate file for storing URL.
obj.write_file()

# Running dredd
exit(obj.dredd_work())
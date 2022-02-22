import os
import json
import unittest#library for testing
import pandas as pd
from io import StringIO
# tests=[]#a list to put boolean results of tests
# #CLI testing for PassesPerStation endpoint
#
# tests.append(output["NumberOfPasses"]==11)
# tests.append(True)
def get_output_json(call):
    """Function that gets cli call and returns json result
        call: string containing the exact command"""

    stream=os.popen(call)
    output=json.loads(stream.read())
    stream.close()
    return output
def get_output_csv_pd(call):
    """Function that gets cli call and returns csv in pandas form
        call: string containing the exact command"""

    stream=os.popen(call)
    outputcsv=stream.read()
    stream.close()
    ocsv=StringIO(outputcsv)
    ocsv=pd.read_csv(ocsv,delimiter=';')
    return ocsv
class PassesPerStationTests(unittest.TestCase):
    """Tests on PassesPerStation endpoint"""

    def test_NumOfPasses1(self):
        """Number of Passes is right"""
        call='../cli/se2162 passesperstation --format json --station AO01 --datefrom 20200101 --dateto 20200131'
        output=get_output_json(call)
        self.assertEqual(output["NumberOfPasses"],11)


    def test_NumOfPasses1csv(self):
        """Number of passes is right with format=csv"""
        call='../cli/se2162 passesperstation --format csv --station AO01 --datefrom 20200101 --dateto 20200131'
        ocsv=get_output_csv_pd(call)
        self.assertEqual(len(ocsv),11)


    def test_FailsWhenWrongDate(self):
        """PassesPerStation returns fail when wrong date is given"""
        call='../cli/se2162 passesperstation --format json --station EG03 --datefrom wrongdate --dateto 20200131'
        output=get_output_json(call)
        self.assertEqual(output["status"],"failed")


    def test_NoData(self):
        """Returns no data when there are no passes"""
        call='../cli/se2162 passesperstation --format json --station EG03 --datefrom 20240115 --dateto 20250115'
        output=get_output_json(call)
        self.assertEqual(output["status"],"failed")
        self.assertEqual(output["details"],"No data.")


    def test_NumOfPasses2(self):
        """Number of Passes is right no2"""
        call='../cli/se2162 passesperstation --format json --station EG03 --datefrom 20200201 --dateto 20200229'
        output=get_output_json(call)
        self.assertEqual(output["NumberOfPasses"],12)


    def test_NumOfPasses2csv(self):
        """Number of Passes is right no2 with csv format"""
        call='../cli/se2162 passesperstation --format csv --station EG03 --datefrom 20200201 --dateto 20200229'
        ocsv=get_output_csv_pd(call)
        self.assertEqual(len(ocsv),12)


class PassesAnalysisTests(unittest.TestCase):
    """Tests on PassesAnalysis endpoint"""
    def test_NumOfPasses(self):
        """Number of passes no1 is right in PassesAnalysis endpoint"""
        call='../cli/se2162 passesanalysis --format json --op1 aodos --op2 olympia_odos  --datefrom 20200101 --dateto 20200131'
        output=get_output_json(call)
        self.assertEqual(output["NumberOfPasses"],12)

    def test_NumOfPassescsv(self):
        """Number of passes no2 is right in PassesAnalysis endpoint with csv format"""
        call='../cli/se2162 passesanalysis --format csv --op1 aodos --op2 olympia_odos  --datefrom 20200101 --dateto 20200131'
        ocsv=get_output_csv_pd(call)
        self.assertEqual(len(ocsv),12)

    def test_FailsWhenWrongDate(self):
        """PassesAnalysis returns fail when wrong date is given"""
        call='../cli/se2162 passesanalysis --format csv --op1 aodos --op2 olympia_odos  --datefrom 20200101 --dateto wrongdate'
        output=get_output_json(call)
        self.assertEqual(output["status"],"failed")

    def test_NumOfPasses2(self):
        """Number of passes no2 is right in PassesAnalysis endpoint"""
        call='../cli/se2162 passesanalysis --format json --op1 aodos --op2 kentriki_odos  --datefrom 20200301 --dateto 20200331'
        output=get_output_json(call)
        self.assertEqual(output["NumberOfPasses"],10)

    def test_NumOfPasses2csv(self):
        """Number of passes no2 is right in PassesAnalysis endpoint with csv format"""
        call='../cli/se2162 passesanalysis --format csv --op1 aodos --op2 kentriki_odos  --datefrom 20200301 --dateto 20200331'
        ocsv=get_output_csv_pd(call)
        self.assertEqual(len(ocsv),10)


class PassesCostTests(unittest.TestCase):
    """Tests on PassesCost endpoint """
    def test_Cost1(self):
        """Cost no1 of Passes on PassesCost endpoint is right"""
        call='../cli/se2162 passescost --format json --op1 egnatia --op2 gefyra  --datefrom 20200101 --dateto 20200131'
        output=get_output_json(call)
        self.assertEqual(output["PassesCost"],3)

    def test_Cost1_csv(self):
        """Cost no1 of Passes on PassesCost endpoint with csv format is right"""
        call='../cli/se2162 passescost --format csv --op1 egnatia --op2 gefyra  --datefrom 20200101 --dateto 20200131'
        ocsv=get_output_csv_pd(call)
        self.assertEqual(ocsv["PassesCost"][0],3)

    def test_FailsWhenWrongDate(self):
        """PassesCost returns fail when wrong date is given"""
        call='../cli/se2162 passescost --format json --op1 egnatia --op2 gefyra  --datefrom 20200101 --dateto wrongdate'
        output=get_output_json(call)
        self.assertEqual(output["status"],"failed")
    def test_CostsZero(self):
        """Passes Cost returns 0 cost when there are no passes in time period"""
        call='../cli/se2162 passescost --format json --op1 egnatia --op2 gefyra  --datefrom 20250101 --dateto 20260131'
        output=get_output_json(call)
        self.assertEqual(output["PassesCost"],0)

    def test_Cost2(self):
        """Cost no2 of Passes on PassesCost endpoint is right"""
        call='../cli/se2162 passescost --format json --op1 egnatia --op2 gefyra  --datefrom 20200201 --dateto 20200229'
        output=get_output_json(call)
        self.assertEqual(output["PassesCost"],13.20)

    def test_Cost2csv(self):
        """Cost no2 of Passes on PassesCost endpoint is right"""
        call='../cli/se2162 passescost --format csv --op1 egnatia --op2 gefyra  --datefrom 20200201 --dateto 20200229'
        ocsv=get_output_csv_pd(call)
        self.assertEqual(ocsv["PassesCost"][0],13.20)
    def test_Cost3(self):
        """Cost no3 of Passes on PassesCost endpoint is right"""
        call='../cli/se2162 passescost --format json --op1 aodos --op2 moreas  --datefrom 20200201 --dateto 20200229'
        output=get_output_json(call)
        self.assertEqual(output["PassesCost"],22.40)

    def test_Cost4(self):
        """Cost no4 of Passes on PassesCost endpoint is right"""
        call='../cli/se2162 passescost --format json --op1 aodos --op2 aodos  --datefrom 20200101 --dateto 20200131'
        output=get_output_json(call)
        self.assertEqual(output["PassesCost"],557.10)


class ChargesByTests(unittest.TestCase):

    def test_CostsPasses1(self):
        """Costs and NumberOfPasses no1 on ChargesBy endpoint are right"""
        call='../cli/se2162 chargesby --format json  --op1 egnatia --datefrom 20200101 --dateto 20200131'
        output=get_output_json(call)
        Corr={ #Dictionary containing the correct values.
                "aodos":(6,10.90),
                "gefyra":(3,3.00),
                "kentriki_odos":(9,19.90),
                "moreas":(4,8.00),
                "nea_odos":(7,10.15),
                "olympia_odos":(5,9.30)
        }
        PPOList=output["PPOList"]
        for i in range(len(PPOList)):
            VisitingOperator=PPOList[i]["VisitingOperator"]
            self.assertEqual(PPOList[i]["NumberOfPasses"],Corr[VisitingOperator][0])
            self.assertEqual(PPOList[i]["PassesCost"],Corr[VisitingOperator][1])

    def test_CostsPasses1csv(self):
        """Costs and NumberOfPasses no1 with format csv on ChargesBy endpoint are right"""
        call='../cli/se2162 chargesby --format csv  --op1 egnatia --datefrom 20200101 --dateto 20200131'
        ocsv=get_output_csv_pd(call)
        Corr={ #Dictionary containing the correct values.
                "aodos":(6,10.90),
                "gefyra":(3,3.00),
                "kentriki_odos":(9,19.90),
                "moreas":(4,8.00),
                "nea_odos":(7,10.15),
                "olympia_odos":(5,9.30)
        }
        for i in range(len(ocsv)):
            VisitingOperator=ocsv.at[i,"VisitingOperator"]
            self.assertEqual(ocsv.at[i,"NumberOfPasses"],Corr[VisitingOperator][0])
            self.assertEqual(ocsv.at[i,"PassesCost"],Corr[VisitingOperator][1])


    def test_FailsWhenWrongDate(self):
        """ChargesBy returns fail when wrong date is given"""
        call='../cli/se2162 chargesby --format json  --op1 egnatia --datefrom wrongdate --dateto 20200131'
        output=get_output_json(call)
        self.assertEqual(output["status"],"failed")
    def test_NoData(self):
        """Returns No data when there are no passes in the time period given"""
        call='../cli/se2162 chargesby --format json  --op1 egnatia --datefrom 20420101 --dateto 20480131'
        output=get_output_json(call)
        self.assertEqual(output["status"],"failed")
        self.assertEqual(output["details"],"No data.")
    def test_CostsPasses2(self):
        """Costs and number of passes no2 on ChargesBy endpoint are right"""
        call='../cli/se2162 chargesby --format json  --op1 gefyra --datefrom 20200201 --dateto 20200229'
        output=get_output_json(call)
        Corr={ #Dictionary containing the correct values.
                "aodos":(1,13.00),
                "egnatia":(1,13.00),
                "olympia_odos":(2,26.00)
        }
        PPOList=output["PPOList"]
        for i in range(len(PPOList)):
            VisitingOperator=PPOList[i]["VisitingOperator"]
            self.assertEqual(PPOList[i]["NumberOfPasses"],Corr[VisitingOperator][0])
            self.assertEqual(PPOList[i]["PassesCost"],Corr[VisitingOperator][1])
if __name__=="__main__":
    unittest.main()
